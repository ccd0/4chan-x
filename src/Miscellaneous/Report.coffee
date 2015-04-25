Report =
  init: ->
    return unless /\bmode=report\b/.test(location.search) and match = location.search.match /\bno=(\d+)/
    @postID = +match[1]
    $.ready @ready

  ready: ->
    new MutationObserver(Report.resize).observe d.body,
      childList:  true
      attributes: true
      subtree:    true
    Report.archive() if Conf['Archive Report']

  resize: ->
    return unless bubble = $ '.gc-bubbleDefault'
    dy = bubble.getBoundingClientRect().bottom - doc.clientHeight
    window.resizeBy 0, dy if dy > 0

  archive: ->
    Redirect.init()
    return unless url = Redirect.to 'report', {boardID: g.BOARD.ID, postID: Report.postID}

    if (message = $ 'h3') and /Report submitted!/.test(message.textContent)
      $.globalEval 'self.close = function(){};'
      window.resizeTo 685, 320
      location.replace url
      return
    link = $.el 'a',
      href: url
      textContent: 'Report to fgts'
    $.on link, 'click', (e) ->
      unless e.shiftKey or e.altKey or e.ctrlKey or e.metaKey or e.button isnt 0
        window.resizeTo 685, 320
    $.add d.body, [$.tn(' ['), link, $.tn(']')]
