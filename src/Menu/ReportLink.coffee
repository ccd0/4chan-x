ReportLink =
  init: ->
    return unless g.VIEW in ['index', 'thread'] and Conf['Menu'] and Conf['Report Link']

    a = $.el 'a',
      className: 'report-link'
      href: 'javascript:;'
      textContent: 'Report'
    $.on a, 'click', ReportLink.report

    Menu.menu.addEntry
      el: a
      order: 10
      open: (post) ->
        ReportLink.url = "//sys.4chan.org/#{post.board}/imgboard.php?mode=report&no=#{post}"
        if d.cookie.indexOf('pass_enabled=1') >= 0
          ReportLink.dims = 'width=350,height=275'
        else
          ReportLink.dims = 'width=400,height=550'
        true

  report: ->
    {url, dims} = ReportLink
    id  = Date.now()
    set = "toolbar=0,scrollbars=1,location=0,status=1,menubar=0,resizable=1,#{dims}"
    window.open url, id, set
