Report =
  css: '''
    :root:not(.js-enabled) #g-recaptcha {
      height: auto;
    }
  '''

  init: ->
    return unless /\bmode=report\b/.test(location.search) and match = location.search.match /\bno=(\d+)/
    @postID = +match[1]
    $.ready @ready

  ready: ->
    $.addStyle Report.css
    Report.archive() if Conf['Archive Report']
    if $.hasClass doc, 'js-enabled'
      new MutationObserver(-> Report.fit '.gc-bubbleDefault').observe d.body,
        childList:  true
        attributes: true
        subtree:    true
    else
      Report.fit 'body'

  fit: (selector) ->
    return unless el = $ selector, doc
    dy = el.getBoundingClientRect().bottom - doc.clientHeight + 8
    window.resizeBy 0, dy if dy > 0

  archive: ->
    Redirect.init()
    return unless url = Redirect.to 'report', {boardID: g.BOARD.ID, postID: Report.postID}

    if (message = $ 'h3') and /Report submitted!/.test(message.textContent)
      $.globalEval 'self.close = function(){};'
      window.resizeBy 0, 350 - doc.clientHeight
      location.replace url
      return
    link = $.el 'a',
      href: url
      textContent: 'Report to fgts'
    $.on link, 'click', (e) ->
      unless e.shiftKey or e.altKey or e.ctrlKey or e.metaKey or e.button isnt 0
        window.resizeBy 0, 350 - doc.clientHeight
    $.add d.body, [$.tn(' ['), link, $.tn(']')]
