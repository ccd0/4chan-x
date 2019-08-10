Report =
  init: ->
    return if not (match = location.search.match /\bno=(\d+)/)
    Captcha.replace.init()
    @postID = +match[1]
    $.ready @ready

  ready: ->
    $.addStyle CSS.report

    Report.archive() if Conf['Archive Report']

    new MutationObserver(->
      Report.fit 'iframe[src^="https://www.google.com/recaptcha/api2/frame"]'
      Report.fit 'body'
    ).observe d.body,
      childList:  true
      attributes: true
      subtree:    true
    Report.fit 'body'

  fit: (selector) ->
    return if not ((el = $ selector, doc) and getComputedStyle(el).visibility isnt 'hidden')
    dy = el.getBoundingClientRect().bottom - doc.clientHeight + 8
    window.resizeBy 0, dy if dy > 0

  archive: ->
    return unless (urls = Redirect.report g.BOARD.ID).length

    form    = $ 'form'
    types   = $.id 'reportTypes'
    message = $ 'h3'

    fieldset = $.el 'fieldset',
      id: 'archive-report'
      hidden: true
    ,
      `<%= readHTML('ArchiveReport.html') %>`
    enabled = $ '#archive-report-enabled', fieldset
    reason  = $ '#archive-report-reason',  fieldset
    submit  = $ '#archive-report-submit',  fieldset

    $.on enabled, 'change', ->
      reason.disabled = !@checked

    if form and types
      fieldset.hidden = !$('[value="31"]', types).checked
      $.on types, 'change', (e) ->
        fieldset.hidden = (e.target.value isnt '31')
        Report.fit 'body'
      $.after types, fieldset
      Report.fit 'body'
      $.one form, 'submit', (e) ->
        if !fieldset.hidden and enabled.checked
          e.preventDefault()
          Report.archiveSubmit urls, reason.value, (results) =>
            @action = '#archiveresults=' + encodeURIComponent JSON.stringify results
            @submit()
    else if message
      fieldset.hidden = /Report submitted!/.test(message.textContent)
      $.on enabled, 'change', ->
        submit.hidden = !@checked
      $.after message, fieldset
      $.on submit, 'click', ->
        Report.archiveSubmit urls, reason.value, Report.archiveResults

    if (match = location.hash.match /^#archiveresults=(.*)$/)
      try
        Report.archiveResults JSON.parse decodeURIComponent match[1]

  archiveSubmit: (urls, reason, cb) ->
    form = $.formData
      board:  g.BOARD.ID
      num:    Report.postID
      reason: reason
    results = []
    for [name, url] in urls
      do (name, url) ->
        $.ajax url, {
          onloadend: ->
            results.push [name, @response or {error: ''}]
            if results.length is urls.length
              cb results
          form
        }
    return

  archiveResults: (results) ->
    fieldset = $.id 'archive-report'
    for [name, response] in results
      line = $.el 'h3',
        className: 'archive-report-response'
      if 'success' of response
        $.addClass line, 'archive-report-success'
        line.textContent = "#{name}: #{response.success}"
      else
        $.addClass line, 'archive-report-error'
        line.textContent = "#{name}: #{response.error or 'Error reporting post.'}"
      if fieldset
        $.before fieldset, line
      else
        $.add d.body, line
    return
