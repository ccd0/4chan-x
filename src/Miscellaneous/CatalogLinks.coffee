CatalogLinks =
  init: ->
    if Conf['External Catalog'] or Conf['JSON Navigation']
      selector = switch g.VIEW
        when 'thread'  then '.navLinks.desktop > a'
        when 'catalog' then '.navLinks > :first-child > a'
        when 'index'   then '.middlead + .desktop > a, .cataloglink > a'
      $.ready ->
        for link in $$ selector
          switch link.pathname
            when "/#{g.BOARD}/"        then link.href = CatalogLinks.index()
            when "/#{g.BOARD}/catalog" then link.href = CatalogLinks.catalog()
        return

    return unless Conf['Catalog Links']
    CatalogLinks.el = el = UI.checkbox 'Header catalog links', ' Catalog Links'
    el.id = 'toggleCatalog'

    input = $ 'input', el
    $.on input, 'change', @toggle
    $.sync 'Header catalog links', CatalogLinks.set

    Header.menu.addEntry
      el:    el
      order: 95

  # Set links on load or custom board list change.
  # Called by Header when both board lists (header and footer) are ready.
  initBoardList: ->
    return unless Conf['Catalog Links']
    CatalogLinks.set Conf['Header catalog links']

  toggle: ->
    $.event 'CloseMenu'
    $.set 'Header catalog links', @checked
    CatalogLinks.set @checked

  set: (useCatalog) ->
    for a in $$ """#board-list a:not([data-only]), #boardNavDesktopFoot a"""
      continue if a.hostname not in ['boards.4chan.org', 'catalog.neet.tv', '4index.gropes.us'] or
      !(board = a.pathname.split('/')[1]) or
      board in ['f', 'status', '4chan'] or
      $.hasClass a, 'external'

      # Href is easier than pathname because then we don't have
      # conditions where External Catalog has been disabled between switches.
      a.href = CatalogLinks[if useCatalog then 'catalog' else 'index'] board

    CatalogLinks.el.title = "Turn catalog links #{if useCatalog then 'off' else 'on'}."

  catalog: (board=g.BOARD.ID) ->
    if Conf['External Catalog'] and board in ['a', 'c', 'g', 'biz', 'k', 'm', 'o', 'p', 'v', 'vg', 'vr', 'w', 'wg', 'cm', '3', 'adv', 'an', 'asp', 'cgl', 'ck', 'co', 'diy', 'fa', 'fit', 'gd', 'int', 'jp', 'lit', 'mlp', 'mu', 'n', 'out', 'po', 'sci', 'sp', 'tg', 'toy', 'trv', 'tv', 'vp', 'wsg', 'x', 'f', 'pol', 's4s', 'lgbt']
      "http://catalog.neet.tv/#{board}"
    else if Conf['JSON Navigation'] and Conf['Use 4chan X Catalog']
      if g.BOARD.ID is board and g.VIEW is 'index' then '#catalog' else "/#{board}/\#catalog"
    else
      "/#{board}/catalog"

  index: (board=g.BOARD.ID) ->
    if Conf['JSON Navigation']
      if g.BOARD.ID is board and g.VIEW is 'index' then '#index' else "/#{board}/\#index"
    else
      "/#{board}/"
