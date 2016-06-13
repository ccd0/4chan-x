Report =
  init: ->
    return unless (match = location.search.match /\bno=(\d+)/)
    Captcha.replace.init()
    @postID = +match[1]
    $.ready @ready

  ready: ->
    $.addStyle CSS.report

    Report.archive() if Conf['Archive Report']

    if not Conf['Use Recaptcha v1 in Reports'] and not Conf['Force Noscript Captcha'] and Main.jsEnabled
      new MutationObserver(->
        Report.fit 'iframe[src^="https://www.google.com/recaptcha/api2/frame"]'
        Report.fit 'body'
      ).observe d.body,
        childList:  true
        attributes: true
        subtree:    true
    else
      Report.fit 'body'

  fit: (selector) ->
    return unless (el = $ selector, doc) and getComputedStyle(el).visibility isnt 'hidden'
    dy = el.getBoundingClientRect().bottom - doc.clientHeight + 8
    window.resizeBy 0, dy if dy > 0

  archive: ->
    Redirect.init()
    return unless (url = Redirect.to 'report', {boardID: g.BOARD.ID, postID: Report.postID})

    if (message = $ 'h3') and /Report submitted!/.test(message.textContent)
      if location.hash is '#redirect'
        $.globalEval 'self.close = function(){};'
        window.resizeTo 700, 475
        location.replace url
      return

    link = $.el 'a',
      href: url
      textContent: 'Report to archive'
    $.on link, 'click', (e) ->
      unless e.shiftKey or e.altKey or e.ctrlKey or e.metaKey or e.button isnt 0
        window.resizeTo 700, 475
    $.add d.body, [$.tn(' ['), link, $.tn(']')]

    if types = $.id('reportTypes')
      $.on types, 'change', (e) ->
        $('form').action = if e.target.value is 'illegal' then '#redirect' else ''

return Report
