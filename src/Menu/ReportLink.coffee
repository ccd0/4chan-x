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
          a.textContent = 'Report this post'
          ReportLink.url = "//sys.4chan.org/#{post.board}/imgboard.php?mode=report&no=#{post}"
          ReportLink.height = 180
        else if Conf['Archive Report']
          a.textContent = 'Report to archive'
          ReportLink.url = Redirect.to 'report', {boardID: post.board.ID, postID: post.ID}
          ReportLink.height = 350
        else
          ReportLink.url = ''
        !!ReportLink.url

  report: ->
    {url, height} = ReportLink
    id  = Date.now()
    set = "toolbar=0,scrollbars=1,location=0,status=1,menubar=0,resizable=1,width=700,height=#{height}"
    window.open url, id, set
