CatalogLinks =
  init: ->
    $.ready @ready 
    return unless Conf['Catalog Links']
    CatalogLinks.el = el = $.el 'label',
      id:           'toggleCatalog'
      href:         'javascript:;'
      innerHTML:    "<input type=checkbox #{if Conf['Header catalog links'] then 'checked' else ''}> Catalog Links"

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
    $.set 'Header catalog links', @checked
    CatalogLinks.set @checked

  set: (useCatalog) ->
    path = if useCatalog then 'catalog' else ''

    generateURL = if useCatalog and Conf['External Catalog']
      CatalogLinks.external
    else
      (board) -> a.href = "/#{board}/#{path}"

    for a in $$ """#board-list a:not(.catalog), #boardNavDesktopFoot a""" 
      continue if not a.hostname in ['boards.4chan.org', 'catalog.neet.tv', '4index.gropes.us'] or
      !(board = a.pathname.split('/')[1]) or
      board in ['f', 'status', '4chan']

      # Href is easier than pathname because then we don't have
      # conditions where External Catalog has been disabled between switches.
      a.href = generateURL board

    CatalogLinks.el.title = "Turn catalog links #{if useCatalog then 'off' else 'on'}."

  external: (board) ->
    switch board
      when 'a', 'c', 'g', 'co', 'k', 'm', 'o', 'p', 'v', 'vg', 'w', 'cm', '3', 'adv', 'an', 'cgl', 'ck', 'diy', 'fa', 'fit', 'int', 'jp', 'mlp', 'lit', 'mu', 'n', 'po', 'sci', 'toy', 'trv', 'tv', 'vp', 'x', 'q'
        "http://catalog.neet.tv/#{board}"
      when 'd', 'e', 'gif', 'h', 'hr', 'hc', 'r9k', 's', 'pol', 'soc', 'u', 'i', 'ic', 'hm', 'r', 'w', 'wg', 'wsg', 't', 'y'
        "http://4index.gropes.us/#{board}"
      else
        "/#{board}/catalog"

  ready: ->
    if catalogLink = ($('.pages.cataloglink a', d.body) or $ '[href=".././catalog"]', d.body)
      catalogLink.textContent = ''
      catalogLink.className = 'a-icon'
      Header.addShortcut catalogLink, true
      catalogLink.id = 'catalog'
