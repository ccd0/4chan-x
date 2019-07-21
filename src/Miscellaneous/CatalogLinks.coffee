CatalogLinks =

  init: ->
    if g.SITE.software is 'yotsuba' and (Conf['External Catalog'] or Conf['JSON Index']) and !(Conf['JSON Index'] and g.VIEW is 'index')
      selector = switch g.VIEW
        when 'thread', 'archive' then '.navLinks.desktop > a'
        when 'catalog'           then '.navLinks > :first-child > a'
        when 'index'             then '#ctrl-top > a, .cataloglink > a'
      $.ready ->
        for link in $$ selector
          switch link.pathname.replace /\/+/g, '/'
            when "/#{g.BOARD}/"
              link.textContent = 'Index' if Conf['JSON Index']
              link.href = CatalogLinks.index()
            when "/#{g.BOARD}/catalog"
              link.href = CatalogLinks.catalog()
          if g.VIEW is 'catalog' and Conf['JSON Index'] and Conf['Use <%= meta.name %> Catalog']
            catalogLink = link.parentNode.cloneNode true
            catalogLink.firstElementChild.textContent = '<%= meta.name %> Catalog'
            catalogLink.firstElementChild.href = CatalogLinks.catalog()
            $.after link.parentNode, [$.tn(' '), catalogLink]
        return

    if g.SITE.software is 'yotsuba' and Conf['JSON Index'] and Conf['Use <%= meta.name %> Catalog']
      Callbacks.Post.push
        name: 'Catalog Link Rewrite'
        cb:   @node

    if (@enabled = Conf['Catalog Links'])
      CatalogLinks.el = el = UI.checkbox 'Header catalog links', 'Catalog Links'
      el.id = 'toggleCatalog'
      input = $ 'input', el
      $.on input, 'change', @toggle
      $.sync 'Header catalog links', CatalogLinks.set
      Header.menu.addEntry
        el:    el
        order: 95

  node: ->
    for a in $$ 'a', @nodes.comment
      if m = a.href.match /^https?:\/\/(boards\.4chan(?:nel)?\.org\/[^\/]+)\/catalog(#s=.*)?/
        a.href = "//#{m[1]}/#{m[2] or '#catalog'}"
    return

  toggle: ->
    $.event 'CloseMenu'
    $.set 'Header catalog links', @checked
    CatalogLinks.set @checked

  set: (useCatalog) ->
    Conf['Header catalog links'] = useCatalog
    CatalogLinks.setLinks Header.boardList
    CatalogLinks.setLinks Header.bottomBoardList
    CatalogLinks.el.title = "Turn catalog links #{if useCatalog then 'off' else 'on'}."
    $('input', CatalogLinks.el).checked = useCatalog

  # Also called by Header when board lists are loaded / generated.
  setLinks: (list) ->
    return unless (CatalogLinks.enabled ? Conf['Catalog Links']) and list

    for a in $$('a:not([data-only])', list)
      unless (board = a.dataset.board)
        continue if (
          a.hostname not in ['boards.4chan.org', 'boards.4channel.org'] or
          !(board = a.pathname.split('/')[1]) or
          board in ['f', 'status', '4chan'] or
          a.pathname.split('/')[2] is 'archive' or
          $.hasClass a, 'external'
        )
        a.dataset.board = board

      # Href is easier than pathname because then we don't have
      # conditions where External Catalog has been disabled between switches.
      a.href = if Conf['Header catalog links'] then CatalogLinks.catalog(board) else "//#{BoardConfig.domain(board)}/#{board}/"

      if a.dataset.indexOptions and a.hostname in ['boards.4chan.org', 'boards.4channel.org'] and a.pathname.split('/')[2] is ''
        a.href += (if a.hash then '/' else '#') + a.dataset.indexOptions
    return

  externalParse: ->
    CatalogLinks.externalList = {}
    for line in Conf['externalCatalogURLs'].split '\n'
      continue if line[0] is '#'
      url = line.split(';')[0]
      boards   = Filter.parseBoards(line.match(/;boards:([^;]+)/)?[1] or '*')
      excludes = Filter.parseBoards(line.match(/;exclude:([^;]+)/)?[1]) or {}
      for board of boards
        unless excludes[board] or excludes[board.split('/')[0] + '/*']
          CatalogLinks.externalList[board] = url
    return

  external: ({siteID, boardID}) ->
    CatalogLinks.externalParse() unless CatalogLinks.externalList
    external = (CatalogLinks.externalList["#{siteID}/#{boardID}"] or CatalogLinks.externalList["#{siteID}/*"])
    if external then external.replace(/%board/g, boardID) else undefined

  catalog: (board=g.BOARD.ID) ->
    siteID = '4chan.org'
    if Conf['External Catalog'] and (external = CatalogLinks.external({siteID, boardID: board}))
      external
    else if Conf['JSON Index'] and Conf['Use <%= meta.name %> Catalog']
      if location.hostname in ['boards.4chan.org', 'boards.4channel.org'] and g.BOARD.ID is board and g.VIEW is 'index' then '#catalog' else "//#{BoardConfig.domain(board)}/#{board}/#catalog"
    else
      "//#{BoardConfig.domain(board)}/#{board}/catalog"

  index: (board=g.BOARD.ID) ->
    if Conf['JSON Index'] and board isnt 'f'
      if location.hostname in ['boards.4chan.org', 'boards.4channel.org'] and g.BOARD.ID is board and g.VIEW is 'index' then '#index' else "//#{BoardConfig.domain(board)}/#{board}/#index"
    else
      "//#{BoardConfig.domain(board)}/#{board}/"
