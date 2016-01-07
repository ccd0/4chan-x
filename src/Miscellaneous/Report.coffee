Report =
  css: `<%= importCSS('report') %>`

  init: ->
    return unless (match = location.search.match /\bno=(\d+)/)
    Captcha.replace.init()
    @postID = +match[1]
    $.ready @ready

  ready: ->
    $.addStyle Report.css

    Report.archive() if Conf['Archive Report']

    if (passAd = $ 'a[href="https://www.4chan.org/pass"]')
      $.extend passAd,
        textContent: 'Complain'
        href:        'https://www.4chan-x.net/captchas.html'
      passAd.parentNode.normalize()
      if (prev = passAd.previousSibling)?.nodeType is Node.TEXT_NODE
        prev.nodeValue = prev.nodeValue.replace /4chan Pass[^\.]*\./i, 'reCAPTCHA malfunctioning?'
      $.after passAd, [
        $.tn '] ['
        $.el 'a',
          href:        'mailto:4chanpass@4chan.org?subject=4chan%20Pass%20-%20Purchase%20Support'
          textContent: 'Email 4chan'
          target:      '_blank'
      ]

    if Conf['Use Recaptcha v2 in Reports'] and not Conf['Force Noscript Captcha'] and Main.jsEnabled
      new MutationObserver(->
        Report.fit 'iframe[src^="https://www.google.com/recaptcha/api2/frame"]'
        Report.fit 'body'
      ).observe d.body,
        childList:  true
        attributes: true
        subtree:    true
    else
      Report.fit 'body'

    if !Conf['Use Recaptcha v2 in Reports'] and Main.jsEnabled and d.cookie.indexOf('pass_enabled=1') < 0
      $.onExists d.body, '#recaptcha_image', (image) ->
        # XXX Native reload-on-click breaks audio captcha.
        $.global -> document.getElementById('recaptcha_image').removeEventListener 'click', window.onAltCaptchaClick, false
        $.on image, 'click', ->
          if $.id 'recaptcha_challenge_image'
            $.global -> window.Recaptcha.reload()
      $.onExists d.body, '#recaptcha_response_field', (field) ->
        $.on field, 'keydown', (e) ->
          if e.keyCode is 8 and not field.value
            $.global -> window.Recaptcha.reload()

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
        window.resizeBy 0, 350 - doc.clientHeight
        location.replace url
      return

    link = $.el 'a',
      href: url
      textContent: 'Report to archive'
    $.on link, 'click', (e) ->
      unless e.shiftKey or e.altKey or e.ctrlKey or e.metaKey or e.button isnt 0
        window.resizeBy 0, 350 - doc.clientHeight
    $.add d.body, [$.tn(' ['), link, $.tn(']')]

    if types = $.id('reportTypes')
      $.on types, 'change', (e) ->
        $('form').action = if e.target.value is 'illegal' then '#redirect' else ''
