ReportLink =
  init: ->
    a = $.el 'a',
      className: 'report_link'
      href: 'javascript:;'
      textContent: 'Report this post'
    $.on a, 'click', @report
    Menu.addEntry
      el: a
      open: (post) ->
        post.isArchived is false
  report: ->
    a   = $ 'a[title="Highlight this post"]', $.id @parentNode.dataset.rootid
    url = "//sys.4chan.org/#{a.pathname.split('/')[1]}/imgboard.php?mode=report&no=#{@parentNode.dataset.id}"
    id  = Date.now()
    set = "toolbar=0,scrollbars=0,location=0,status=1,menubar=0,resizable=1,width=685,height=200"
    window.open url, id, set