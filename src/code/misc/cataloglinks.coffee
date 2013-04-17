CatalogLinks =
  init: ->
    $.ready @ready 
    return unless Conf['Catalog Links']
    el = $.el 'a',
      id:           'toggleCatalog'
      href:         'javascript:;'
      className:    if Conf['Header catalog links'] then 'disabled' else ''
      textContent:  'Catalog'
      title:        "Turn catalog links #{if Conf['Header catalog links'] then 'off' else 'on'}."
    $.on el, 'click', @toggle

    Header.addShortcut el

    $.asap (-> d.body), ->
      return unless Main.isThisPageLegit()
      # Wait for #boardNavMobile instead of #boardNavDesktop,
      # it might be incomplete otherwise.
      $.asap (-> $.id 'boardNavMobile'), ->
        # Set links on load.
        CatalogLinks.toggle.call el

  toggle: ->
    $.set 'Header catalog links', useCatalog = @className is 'disabled'
    $.toggleClass @, 'disabled'
    for a in $$ 'a', $.id('boardNavDesktop')
      board = a.pathname.split('/')[1]
      continue if ['f', 'status', '4chan'].contains(board) or !board
      if Conf['External Catalog']
        a.href = if useCatalog
          CatalogLinks.external(board)
        else
          "//boards.4chan.org/#{board}/"
      else
        a.pathname = "/#{board}/#{if useCatalog then 'catalog' else ''}"
      a.title = if useCatalog then "#{a.title} - Catalog" else a.title.replace(/\ -\ Catalog$/, '')
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

  ready: ->
    if catalogLink = ($('.pages.cataloglink a', d.body) or $ '[href=".././catalog"]', d.body)
      if g.VIEW isnt 'thread'
        $.add d.body, catalogLink
      catalogLink.id = 'catalog'