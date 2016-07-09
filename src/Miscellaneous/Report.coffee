Report =
  init: ->
    return unless (match = location.search.match /\bno=(\d+)/)
    Captcha.replace.init()
    @postID = +match[1]
    $.ready @ready

  ready: ->
    $.addStyle CSS.report

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
