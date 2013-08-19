CatalogLinks =
  init: ->
    $.ready @ready 
    return unless Conf['Catalog Links']
    el = $.el 'label',
      id:           'toggleCatalog'
      href:         'javascript:;'
      innerHTML:    "<input type=checkbox #{if Conf['Header catalog links'] then 'checked' else ''}> Catalog Links"
      title:        "Turn catalog links #{if Conf['Header catalog links'] then 'off' else 'on'}."

    input = $ 'input', el
    $.on input, 'change', @toggle
    $.sync 'Header catalog links', CatalogLinks.set

    $.event 'AddMenuEntry',
      type:  'header'
      el:    el
      order: 95

    $.on d, '4chanXInitFinished', ->
      # Set links on load.
      CatalogLinks.set Conf['Header catalog links']

  toggle: ->
    $.event 'CloseMenu'
    $.set 'Header catalog links', useCatalog = @checked
    CatalogLinks.set useCatalog

  set: (useCatalog) ->
    path = if useCatalog then 'catalog' else ''
    for a in $$ """
      #board-list a[href*="boards.4chan.org"]:not(.catalog),
      #boardNavDesktopFoot a[href*="boards.4chan.org"]
    """
      board = a.pathname.split('/')[1]
      continue if ['f', 'status', '4chan'].contains(board) or !board
      if Conf['External Catalog']
        a.href = if useCatalog
          CatalogLinks.external board
        else
          "//boards.4chan.org/#{board}/"
      else
        a.pathname = "/#{board}/#{path}"
    @title = "Turn catalog links #{if useCatalog then 'off' else 'on'}."

  external: (board) ->
    return (
      if ['a', 'c', 'g', 'co', 'k', 'm', 'o', 'p', 'v', 'vg', 'w', 'cm', '3', 'adv', 'an', 'cgl', 'ck', 'diy', 'fa', 'fit', 'int', 'jp', 'mlp', 'lit', 'mu', 'n', 'po', 'sci', 'toy', 'trv', 'tv', 'vp', 'x', 'q'].contains board
        "http://catalog.neet.tv/#{board}"
      else if ['d', 'e', 'gif', 'h', 'hr', 'hc', 'r9k', 's', 'pol', 'soc', 'u', 'i', 'ic', 'hm', 'r', 'w', 'wg', 'wsg', 't', 'y'].contains board
        "http://4index.gropes.us/#{board}"
      else
        "//boards.4chan.org/#{board}/catalog"
    )

  ready: ->
    if catalogLink = ($('.pages.cataloglink a', d.body) or $ '[href=".././catalog"]', d.body)
      catalogLink.textContent = ''
      Header.addShortcut catalogLink
      catalogLink.id = 'catalog'
