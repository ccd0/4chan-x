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
          if g.VIEW is 'catalog' and (catalogURL = CatalogLinks.catalog()) isnt g.SITE.urls.catalog?(g.BOARD)
            catalogLink = link.parentNode.cloneNode true
            link2 = catalogLink.firstElementChild
            link2.href = catalogURL
            link2.textContent = if link2.hostname is location.hostname then '<%= meta.name %> Catalog' else 'External Catalog'
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

    # do not transform links unless they differ from the expected value at most by this tail
    tail = /(?:index)?(?:\.\w+)?$/

    for a in $$('a:not([data-only])', list)
      {siteID, boardID} = a.dataset
      unless siteID and boardID
        {siteID, boardID, VIEW} = Site.parseURL a
        continue unless (
          siteID and boardID and
          VIEW in ['index', 'catalog'] and
          (a.dataset.indexOptions or a.href.replace(tail, '') is (Get.url(VIEW, {siteID, boardID}) or '').replace(tail, ''))
        )
        $.extend a.dataset, {siteID, boardID}

      board = {siteID, boardID}
      url = if Conf['Header catalog links'] then CatalogLinks.catalog(board) else Get.url('index', board)
      if url
        a.href = url
        if a.dataset.indexOptions and url.split('#')[0] is Get.url('index', board)
          a.href += (if a.hash then '/' else '#') + a.dataset.indexOptions
    return

  externalParse: ->
    CatalogLinks.externalList = $.dict()
    for line in Conf['externalCatalogURLs'].split '\n'
      continue if line[0] is '#'
      url = line.split(';')[0]
      boards   = Filter.parseBoards(line.match(/;boards:([^;]+)/)?[1] or '*')
      excludes = Filter.parseBoards(line.match(/;exclude:([^;]+)/)?[1]) or $.dict()
      for board of boards
        unless excludes[board] or excludes[board.split('/')[0] + '/*']
          CatalogLinks.externalList[board] = url
    return

  external: ({siteID, boardID}) ->
    CatalogLinks.externalParse() unless CatalogLinks.externalList
    external = (CatalogLinks.externalList["#{siteID}/#{boardID}"] or CatalogLinks.externalList["#{siteID}/*"])
    if external then external.replace(/%board/g, boardID) else undefined

  jsonIndex: (board, hash) ->
    if g.SITE.ID is board.siteID and g.BOARD.ID is board.boardID and g.VIEW is 'index'
      hash
    else
      Get.url('index', board) + hash

  catalog: (board=g.BOARD) ->
    if Conf['External Catalog'] and (external = CatalogLinks.external board)
      external
    else if Index.enabledOn(board) and Conf['Use <%= meta.name %> Catalog']
      CatalogLinks.jsonIndex board, '#catalog'
    else if (nativeCatalog = Get.url 'catalog', board)
      nativeCatalog
    else
      CatalogLinks.external board

  index: (board=g.BOARD) ->
    if Index.enabledOn(board)
      CatalogLinks.jsonIndex board, '#index'
    else
      Get.url 'index', board
