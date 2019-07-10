Header =
  init: ->
    @menu = new UI.Menu 'header'

    menuButton = $.el 'span',
      className: 'menu-button'
    $.extend menuButton, <%= html('<i></i>') %>

    box = UI.checkbox

    barFixedToggler     = box 'Fixed Header',               'Fixed Header'
    headerToggler       = box 'Header auto-hide',           'Auto-hide header'
    scrollHeaderToggler = box 'Header auto-hide on scroll', 'Auto-hide header on scroll'
    barPositionToggler  = box 'Bottom Header',              'Bottom header'
    linkJustifyToggler  = box 'Centered links',             'Centered links'
    customNavToggler    = box 'Custom Board Navigation',    'Custom board navigation'
    footerToggler       = box 'Bottom Board List',          'Hide bottom board list'
    shortcutToggler     = box 'Shortcut Icons',             'Shortcut Icons'
    editCustomNav = $.el 'a',
      textContent: 'Edit custom board navigation'
      href: 'javascript:;'

    @barFixedToggler     = barFixedToggler.firstElementChild
    @scrollHeaderToggler = scrollHeaderToggler.firstElementChild
    @barPositionToggler  = barPositionToggler.firstElementChild
    @linkJustifyToggler  = linkJustifyToggler.firstElementChild
    @headerToggler       = headerToggler.firstElementChild
    @footerToggler       = footerToggler.firstElementChild
    @shortcutToggler     = shortcutToggler.firstElementChild
    @customNavToggler    = customNavToggler.firstElementChild

    $.on menuButton,           'click',  @menuToggle
    $.on @headerToggler,       'change', @toggleBarVisibility
    $.on @barFixedToggler,     'change', @toggleBarFixed
    $.on @barPositionToggler,  'change', @toggleBarPosition
    $.on @scrollHeaderToggler, 'change', @toggleHideBarOnScroll
    $.on @linkJustifyToggler,  'change', @toggleLinkJustify
    $.on @footerToggler,       'change', @toggleFooterVisibility
    $.on @shortcutToggler,     'change', @toggleShortcutIcons
    $.on @customNavToggler,    'change', @toggleCustomNav
    $.on editCustomNav,        'click',  @editCustomNav

    @setBarFixed        Conf['Fixed Header']
    @setHideBarOnScroll Conf['Header auto-hide on scroll']
    @setBarVisibility   Conf['Header auto-hide']
    @setLinkJustify     Conf['Centered links']
    @setShortcutIcons   Conf['Shortcut Icons']
    @setFooterVisibility Conf['Bottom Board List']

    $.sync 'Fixed Header',               @setBarFixed
    $.sync 'Header auto-hide on scroll', @setHideBarOnScroll
    $.sync 'Bottom Header',              @setBarPosition
    $.sync 'Shortcut Icons',             @setShortcutIcons
    $.sync 'Header auto-hide',           @setBarVisibility
    $.sync 'Centered links',             @setLinkJustify
    $.sync 'Bottom Board List',          @setFooterVisibility

    @addShortcut 'menu', menuButton, 900

    @menu.addEntry
      el: $.el 'span',
        textContent: 'Header'
      order: 107
      subEntries: [
          el: barFixedToggler
        ,
          el: headerToggler
        ,
          el: scrollHeaderToggler
        ,
          el: barPositionToggler
        ,
          el: linkJustifyToggler
        ,
          el: footerToggler
        ,
          el: shortcutToggler
        ,
          el: customNavToggler
        ,
          el: editCustomNav
      ]

    $.on window, 'load popstate', Header.hashScroll
    $.on d, 'CreateNotification', @createNotification

    @setBoardList()

    $.onExists doc, 'body', =>
      return unless Main.isThisPageLegit()
      $.prepend d.body, @bar
      $.add d.body, Header.hover
      @setBarPosition Conf['Bottom Header']

    $.onExists doc, "#{g.SITE.selectors.boardList} + *", Header.generateFullBoardList

    Main.ready ->
      if g.SITE.software is 'yotsuba' and not (footer = $.id 'boardNavDesktopFoot')
        return unless (absbot = $.id 'absbot')
        footer = $.id('boardNavDesktop').cloneNode true
        footer.id = 'boardNavDesktopFoot'
        $('#navtopright',        footer).id = 'navbotright'
        $('#settingsWindowLink', footer).id = 'settingsWindowLinkBot'
        $.before absbot, footer
        $.globalEval 'window.cloneTopNav = function() {};'
      if (Header.bottomBoardList = $ g.SITE.selectors.boardListBottom)
        for a in $$ 'a', Header.bottomBoardList
          a.className = 'current' if a.hostname is location.hostname and a.pathname.split('/')[1] is g.BOARD.ID
        CatalogLinks.setLinks Header.bottomBoardList

    if g.SITE.software is 'yotsuba' and (g.VIEW is 'catalog' or !Conf['Disable Native Extension'])
      cs = $.el 'a', href: 'javascript:;'
      if g.VIEW is 'catalog'
        cs.title = cs.textContent = 'Catalog Settings'
        cs.className = 'fa fa-book'
      else
        cs.title = cs.textContent = '4chan Settings'
        cs.className = 'native-settings'
      $.on cs, 'click', () ->
        $.id('settingsWindowLink').click()
      @addShortcut 'native', cs, 810

    @enableDesktopNotifications()

  bar: $.el 'div',
    id: 'header-bar'

  noticesRoot: $.el 'div',
    id: 'notifications'

  shortcuts: $.el 'span',
    id: 'shortcuts'

  hover: $.el 'div',
    id: 'hoverUI'

  toggle: $.el 'div',
    id: 'scroll-marker'

  setBoardList: ->
    Header.boardList = boardList = $.el 'span',
      id: 'board-list'
    $.extend boardList, <%= html(
      '<span id="custom-board-list"></span>' +
      '<span id="full-board-list" hidden>' +
        '<span class="hide-board-list-container brackets-wrap">' +
          '<a href="javascript:;" class="hide-board-list-button">&nbsp;-&nbsp;</a>' +
        '</span>' +
        ' ' +
        '<span class="boardList"></span>' +
      '</span>'
    ) %>

    btn = $('.hide-board-list-button', boardList)
    $.on btn, 'click', Header.toggleBoardList

    $.add Header.bar, [Header.boardList, Header.shortcuts, Header.noticesRoot, Header.toggle]

    Header.setCustomNav Conf['Custom Board Navigation']
    Header.generateBoardList Conf['boardnav']

    $.sync 'Custom Board Navigation', Header.setCustomNav
    $.sync 'boardnav', Header.generateBoardList

  generateFullBoardList: ->
    nodes = []
    spacer = -> $.el 'span', className: 'spacer'
    items = $.X './/a|.//text()[not(ancestor::a)]', $(g.SITE.selectors.boardList)
    i = 0
    while node = items.snapshotItem i++
      switch node.nodeName
        when '#text'
          for chr in node.nodeValue
            span = $.el 'span', textContent: chr
            span.className = 'space' if chr is ' '
            nodes.push spacer() if chr is ']'
            nodes.push span
            nodes.push spacer() if chr is '['
        when 'A'
          a = node.cloneNode true
          a.className = 'current' if a.hostname is location.hostname and a.pathname.split('/')[1] is g.BOARD.ID
          nodes.push a
    fullBoardList = $ '.boardList', Header.boardList
    $.add fullBoardList, nodes
    CatalogLinks.setLinks fullBoardList

  generateBoardList: (boardnav) ->
    list = $ '#custom-board-list', Header.boardList
    $.rmAll list
    return unless boardnav
    boardnav = boardnav.replace /(\r\n|\n|\r)/g, ' '
    re = /[\w@]+(-(all|title|replace|full|index|catalog|archive|expired|(mode|sort|text):"[^"]+"(,"[^"]+")?))*|[^\w@]+/g
    nodes = (Header.mapCustomNavigation(t) for t in boardnav.match re)
    $.add list, nodes
    CatalogLinks.setLinks list

  mapCustomNavigation: (t) ->
    if /^[^\w@]/.test t
      return $.tn t

    text = url = null
    t = t.replace /-text:"([^"]+)"(?:,"([^"]+)")?/g, (m0, m1, m2) ->
      text = m1
      url  = m2
      ''

    indexOptions = []
    t = t.replace /-(?:mode|sort):"([^"]+)"/g, (m0, m1) ->
      indexOptions.push m1.toLowerCase().replace(/\ /g, '-')
      ''
    indexOptions = indexOptions.join('/')

    if /^toggle-all/.test t
      a = $.el 'a',
        className: 'show-board-list-button'
        textContent: text or '+'
        href: 'javascript:;'
      $.on a, 'click', Header.toggleBoardList
      return a

    if /^external/.test t
      a = $.el 'a',
        href: url or 'javascript:;'
        textContent: text or '+'
        className: 'external'
      return a

    boardID = t.split('-')[0]
    if boardID is 'current'
      if location.hostname in ['boards.4chan.org', 'boards.4channel.org']
        boardID = g.BOARD.ID
      else
        a = $.el 'a',
          href: "/#{g.BOARD.ID}/"
          textContent: text or g.BOARD.ID
          className: 'current'
        if /-catalog/.test(t)
          a.href += 'catalog.html'
        else if /-(archive|expired)/.test(t)
          a = a.firstChild # Its text node.
        return a

    a = do ->
      if boardID is '@'
        return $.el 'a',
          href: 'https://twitter.com/4chan'
          title: '4chan Twitter'
          textContent: '@'

      a = $.el 'a',
        href: "//#{BoardConfig.domain(boardID)}/#{boardID}/"
        textContent: boardID
        title: BoardConfig.title(boardID)
      a.href += g.VIEW if g.VIEW in ['catalog', 'archive']
      a.className = 'current' if a.hostname is location.hostname and boardID is g.BOARD.ID
      a

    a.textContent = if /-title/.test(t) or /-replace/.test(t) and a.hostname is location.hostname and boardID is g.BOARD.ID
      a.title or a.textContent
    else if /-full/.test t
      ("/#{boardID}/") + (if a.title then " - #{a.title}" else '')
    else
      text or boardID

    if m = t.match /-(index|catalog)/
      unless boardID is 'f' and m[1] is 'catalog'
        a.dataset.only = m[1]
        a.href = CatalogLinks[m[1]] boardID
        $.addClass a, 'catalog' if m[1] is 'catalog'
      else
        return a.firstChild # Its text node.

    if Conf['JSON Index'] and indexOptions
      a.dataset.indexOptions = indexOptions
      if a.hostname in ['boards.4chan.org', 'boards.4channel.org'] and a.pathname.split('/')[2] is ''
        a.href += (if a.hash then '/' else '#') + indexOptions

    if /-archive/.test t
      if href = Redirect.to 'board', {boardID}
        a.href = href
      else
        return a.firstChild # Its text node.

    if /-expired/.test t
      if BoardConfig.isArchived(boardID)
        a.href = "//#{BoardConfig.domain(boardID)}/#{boardID}/archive"
      else
        return a.firstChild # Its text node.

    $.addClass a, 'navSmall' if boardID is '@'
    a

  toggleBoardList: ->
    {bar}  = Header
    custom = $ '#custom-board-list', bar
    full   = $ '#full-board-list',   bar
    showBoardList = !full.hidden
    custom.hidden = !showBoardList
    full.hidden   =  showBoardList

  setLinkJustify: (centered) ->
    Header.linkJustifyToggler.checked = centered
    if centered
      $.addClass doc, 'centered-links'
    else
      $.rmClass doc, 'centered-links'

  toggleLinkJustify: ->
    $.event 'CloseMenu'
    centered = if @nodeName is 'INPUT'
      @checked
    Header.setLinkJustify centered
    $.set 'Centered links', centered

  setBarFixed: (fixed) ->
    Header.barFixedToggler.checked = fixed
    if fixed
      $.addClass doc, 'fixed'
      $.addClass Header.bar, 'dialog'
    else
      $.rmClass doc, 'fixed'
      $.rmClass Header.bar, 'dialog'

  toggleBarFixed: ->
    $.event 'CloseMenu'

    Header.setBarFixed @checked

    Conf['Fixed Header'] = @checked
    $.set 'Fixed Header',  @checked

  setShortcutIcons: (show) ->
    Header.shortcutToggler.checked = show
    if show
      $.addClass doc, 'shortcut-icons'
    else
      $.rmClass doc, 'shortcut-icons'

  toggleShortcutIcons: ->
    $.event 'CloseMenu'

    Header.setShortcutIcons @checked

    Conf['Shortcut Icons'] = @checked
    $.set 'Shortcut Icons',  @checked

  setBarVisibility: (hide) ->
    Header.headerToggler.checked = hide
    $.event 'CloseMenu'
    (if hide then $.addClass else $.rmClass) Header.bar, 'autohide'
    (if hide then $.addClass else $.rmClass) doc, 'autohide'

  toggleBarVisibility: ->
    hide = if @nodeName is 'INPUT'
      @checked
    else
      !$.hasClass Header.bar, 'autohide'

    Conf['Header auto-hide'] = hide
    $.set 'Header auto-hide', hide
    Header.setBarVisibility hide
    message = "The header bar will #{if hide
      'automatically hide itself.'
    else
      'remain visible.'}"
    new Notice 'info', message, 2

  setHideBarOnScroll: (hide) ->
    Header.scrollHeaderToggler.checked = hide
    if hide
      $.on window, 'scroll', Header.hideBarOnScroll
      return
    $.off window, 'scroll', Header.hideBarOnScroll
    $.rmClass Header.bar, 'scroll'
    Header.bar.classList.toggle 'autohide', Conf['Header auto-hide']

  toggleHideBarOnScroll: ->
    hide = @checked
    $.cb.checked.call @
    Header.setHideBarOnScroll hide

  hideBarOnScroll: ->
    offsetY = window.pageYOffset
    if offsetY > (Header.previousOffset or 0)
      $.addClass Header.bar, 'autohide', 'scroll'
    else
      $.rmClass Header.bar,  'autohide', 'scroll'
    Header.previousOffset = offsetY

  setBarPosition: (bottom) ->
    Header.barPositionToggler.checked = bottom
    $.event 'CloseMenu'
    args = if bottom then [
      'bottom-header'
      'top-header'
      'after'
    ] else [
      'top-header'
      'bottom-header'
      'add'
    ]

    $.addClass doc, args[0]
    $.rmClass  doc, args[1]
    $[args[2]] Header.bar, Header.noticesRoot

  toggleBarPosition: ->
    $.cb.checked.call @
    Header.setBarPosition @checked

  setFooterVisibility: (hide) ->
    Header.footerToggler.checked = hide
    doc.classList.toggle 'hide-bottom-board-list', hide

  toggleFooterVisibility: ->
    $.event 'CloseMenu'
    hide = if @nodeName is 'INPUT'
      @checked
    else
      $.hasClass doc, 'hide-bottom-board-list'
    Header.setFooterVisibility hide
    $.set 'Bottom Board List', hide
    message = if hide
      'The bottom navigation will now be hidden.'
    else
      'The bottom navigation will remain visible.'
    new Notice 'info', message, 2

  setCustomNav: (show) ->
    Header.customNavToggler.checked = show
    cust = $ '#custom-board-list', Header.bar
    full = $ '#full-board-list',   Header.bar
    btn = $ '.hide-board-list-container', full
    [cust.hidden, full.hidden, btn.hidden] = if show
      [false, true, false]
    else
      [true, false, true]

  toggleCustomNav: ->
    $.cb.checked.call @
    Header.setCustomNav @checked

  editCustomNav: ->
    Settings.open 'Advanced'
    settings = $.id 'fourchanx-settings'
    $('[name=boardnav]', settings).focus()

  hashScroll: (e) ->
    if e
      # Don't scroll when navigating to an already visited state.
      return if e.state
      history.replaceState {}, '' unless history.state

    if (hash = location.hash[1..])
      ReplyPruning.showIfHidden hash
      if (el = $.id hash)
        $.queueTask -> Header.scrollTo el

  scrollTo: (root, down, needed) ->
    return unless root.offsetParent # hidden or fixed
    if down
      x = Header.getBottomOf root
      if Conf['Fixed Header'] and Conf['Header auto-hide on scroll'] and Conf['Bottom header']
        {height} = Header.bar.getBoundingClientRect()
        if x <= 0
          x += height if !Header.isHidden()
        else
          x -= height if  Header.isHidden()
      window.scrollBy 0, -x unless needed and x >= 0
    else
      x = Header.getTopOf root
      if Conf['Fixed Header'] and Conf['Header auto-hide on scroll'] and !Conf['Bottom header']
        {height} = Header.bar.getBoundingClientRect()
        if x >= 0
          x += height if !Header.isHidden()
        else
          x -= height if  Header.isHidden()
      window.scrollBy 0,  x unless needed and x >= 0

  scrollToIfNeeded: (root, down) ->
    Header.scrollTo root, down, true

  getTopOf: (root) ->
    {top} = root.getBoundingClientRect()
    if Conf['Fixed Header'] and not Conf['Bottom Header']
      headRect = Header.toggle.getBoundingClientRect()
      top     -= headRect.top + headRect.height
    top

  getBottomOf: (root) ->
    {clientHeight} = doc
    bottom = clientHeight - root.getBoundingClientRect().bottom
    if Conf['Fixed Header'] and Conf['Bottom Header']
      headRect = Header.toggle.getBoundingClientRect()
      bottom  -= clientHeight - headRect.bottom + headRect.height
    bottom

  isNodeVisible: (node) ->
    return false if d.hidden or !doc.contains node
    {height} = node.getBoundingClientRect()
    Header.getTopOf(node) + height >= 0 and Header.getBottomOf(node) + height >= 0

  isHidden: ->
    {top} = Header.bar.getBoundingClientRect()
    if Conf['Bottom header']
      top is doc.clientHeight
    else
      top < 0

  addShortcut: (id, el, index) ->
    shortcut = $.el 'span',
      id: "shortcut-#{id}"
      className: 'shortcut brackets-wrap'
    $.add shortcut, el
    shortcut.dataset.index = index
    for item in $$('[data-index]', Header.shortcuts) when +item.dataset.index > +index
      $.before item, shortcut
      return
    $.add Header.shortcuts, shortcut

  rmShortcut: (el) ->
    $.rm el.parentElement

  menuToggle: (e) ->
    Header.menu.toggle e, @, g

  createNotification: (e) ->
    {type, content, lifetime} = e.detail
    notice = new Notice type, content, lifetime

  areNotificationsEnabled: false
  enableDesktopNotifications: ->
    return unless window.Notification and Conf['Desktop Notifications']
    switch Notification.permission
      when 'granted'
        Header.areNotificationsEnabled = true
        return
      when 'denied'
        # requestPermission doesn't work if status is 'denied',
        # but it'll still work if status is 'default'.
        return

    el = $.el 'span',
      <%= html(
        meta.name + ' needs your permission to show desktop notifications. ' +
        '[<a href="' + meta.faq + '#why-is-4chan-x-asking-for-permission-to-show-desktop-notifications" target="_blank">FAQ</a>]<br>' +
        '<button>Authorize</button> or <button>Disable</button>'
      ) %>
    [authorize, disable] = $$ 'button', el
    $.on authorize, 'click', ->
      Notification.requestPermission (status) ->
        Header.areNotificationsEnabled = status is 'granted'
        return if status is 'default'
        notice.close()
    $.on disable, 'click', ->
      $.set 'Desktop Notifications', false
      notice.close()
    notice = new Notice 'info', el
