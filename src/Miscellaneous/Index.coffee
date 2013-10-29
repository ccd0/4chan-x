Index =
  init: ->
    return if g.VIEW isnt 'index'

  update: ->
    # return unless navigator.onLine
    Index.req?.abort()
    Index.notice?.close()
    Index.notice = new Notice 'info', 'Refreshing index...'
    Index.req = $.ajax "//api.4chan.org/#{g.BOARD}/catalog.json",
      onabort:   Index.load
      onloadend: Index.load
    ,
      whenModified: true
  load: (e) ->
    {req, notice} = Index
    delete Index.req
    delete Index.notice

    if e.type is 'abort'
      req.onloadend = null
      notice.close()
      return

    try
      Index.parse JSON.parse req.response
    catch e
      # network error or non-JSON content for example.
      notice.setType 'error'
      notice.el.lastElementChild.textContent = 'Index refresh failed.'
      setTimeout notice.close, 2 * $.SECOND
      return

    notice.setType 'success'
    notice.el.lastElementChild.textContent = 'Index refreshed!'
    setTimeout notice.close, $.SECOND

    Header.scrollTo $.id 'delform'
  parse: (pages) ->
    pageNum = +window.location.pathname.split('/')[2]
    threads = pages[pageNum].threads
