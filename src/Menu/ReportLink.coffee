ReportLink =
  init: ->
    return unless g.VIEW in ['index', 'thread'] and Conf['Menu'] and Conf['Report Link']

    a = $.el 'a',
      className: 'report-link'
      href: 'javascript:;'
      textContent: 'Report this post'
    $.on a, 'click', ReportLink.report
    Menu.menu.addEntry
      el: a
      order: 10
      open: (post) ->
        ReportLink.url = unless post.isDead
          "//sys.4chan.org/#{post.board}/imgboard.php?mode=report&no=#{post}"
        else if Conf['Archive Report']
          Redirect.to 'report', {boardID: post.board.ID, postID: post.ID}
        !!ReportLink.url

  report: ->
    {url} = ReportLink
    id  = Date.now()
    height = if d.cookie.indexOf('pass_enabled=1') >= 0 then 200 else 675
    set = "toolbar=0,scrollbars=1,location=0,status=1,menubar=0,resizable=1,width=685,height=#{height}"
    window.open url, id, set
