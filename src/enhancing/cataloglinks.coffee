CatalogLinks =
  init: ->
    el = $.el 'span',
      id:        'toggleCatalog'
      innerHTML: '[<a href=javascript:;></a>]'
    $.on (a = el.firstElementChild), 'click', @toggle
    $.add $.id('boardNavDesktop'), [$.tn(' '), el]

    # Set links on load.
    @toggle.call a, true

  toggle: (onLoad) ->
    if onLoad is true
      useCatalog = $.get 'CatalogIsToggled', g.CATALOG
    else
      $.set 'CatalogIsToggled', useCatalog = @textContent is 'Catalog Off'
    for a in $$ 'a', $.id('boardNavDesktop')
      board = a.pathname.split('/')[1]
      if ['f', 'status', '4chan'].contains(board) or !board
        if board is 'f'
          a.pathname = '/f/'
        continue
      if Conf['External Catalog']
        a.href = if useCatalog
          CatalogLinks.external(board)
        else
          "//boards.4chan.org/#{board}/"
      else
        a.pathname = "/#{board}/#{if useCatalog then 'catalog' else ''}"
      a.title = if useCatalog then "#{a.title} - Catalog" else a.title.replace(/\ -\ Catalog$/, '')
    @textContent = "Catalog #{if useCatalog then 'On' else 'Off'}"
    @title       = "Turn catalog links #{if useCatalog then 'off' else 'on'}."

  external: (board) ->
    return (
      if ['a', 'c', 'g', 'co', 'k', 'm', 'o', 'p', 'v', 'vg', 'w', 'cm', '3', 'adv', 'an', 'cgl', 'ck', 'diy', 'fa', 'fit', 'int', 'jp', 'mlp', 'lit', 'mu', 'n', 'po', 'sci', 'toy', 'trv', 'tv', 'vp', 'x', 'q'].contains board
        "http://catalog.neet.tv/#{board}"
      else if ['d', 'e', 'gif', 'h', 'hr', 'hc', 'r9k', 's', 'pol', 'soc', 'u', 'i', 'ic', 'hm', 'r', 'w', 'wg', 'wsg', 't', 'y'].contains board
        "http://4index.gropes.us/#{board}"
      else
        "//boards.4chan.org/#{board}/catalog"
    )