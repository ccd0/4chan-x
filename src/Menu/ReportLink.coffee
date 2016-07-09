ReportLink =
  init: ->
    return unless g.VIEW in ['index', 'thread'] and Conf['Menu'] and Conf['Report Link']

    a = $.el 'a',
      className: 'report-link'
      href: 'javascript:;'
    $.on a, 'click', ReportLink.report

    Menu.menu.addEntry
      el: a
      order: 10
      open: (post) ->
        unless post.isDead or (post.thread.isDead and not post.thread.isArchived)
          a.textContent = 'Report'
          ReportLink.url = "//sys.4chan.org/#{post.board}/imgboard.php?mode=report&no=#{post}"
          if (Conf['Use Recaptcha v1 in Reports'] and Main.jsEnabled) or d.cookie.indexOf('pass_enabled=1') >= 0
            ReportLink.url += '&altc=1'
            ReportLink.dims = 'width=350,height=275'
          else
            ReportLink.dims = 'width=400,height=550'
        else
          ReportLink.url = ''
        !!ReportLink.url

  report: ->
    {url, dims} = ReportLink
    id  = Date.now()
    set = "toolbar=0,scrollbars=1,location=0,status=1,menubar=0,resizable=1,#{dims}"
    window.open url, id, set
