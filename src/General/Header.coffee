Header =
  init: ->
    @menu = new UI.Menu 'header'

    menuButton = $.el 'a',
      className: 'menu-button a-icon'
      id:        'main-menu'

    box = UI.checkbox

    barFixedToggler     = box 'Fixed Header',               'Fixed Header'
    headerToggler       = box 'Header auto-hide',           'Auto-hide header'
    scrollHeaderToggler = box 'Header auto-hide on scroll', 'Auto-hide header on scroll'
    barPositionToggler  = box 'Bottom Header',              'Bottom header'
    customNavToggler    = box 'Custom Board Navigation',    'Custom board navigation'

    editCustomNav = $.el 'a',
      textContent: 'Edit custom board navigation'
      href: 'javascript:;'

    @barFixedToggler     = barFixedToggler.firstElementChild
    @scrollHeaderToggler = scrollHeaderToggler.firstElementChild
    @barPositionToggler  = barPositionToggler.firstElementChild
    @headerToggler       = headerToggler.firstElementChild
    @customNavToggler    = customNavToggler.firstElementChild

    $.on menuButton,           'click',  @menuToggle
    $.on @headerToggler,       'change', @toggleBarVisibility
    $.on @barFixedToggler,     'change', @toggleBarFixed
    $.on @barPositionToggler,  'change', @toggleBarPosition
    $.on @scrollHeaderToggler, 'change', @setHideBarOnScroll
    $.on @customNavToggler,    'change', @toggleCustomNav
    $.on editCustomNav,        'click',  @editCustomNav

    @setBarFixed        Conf['Fixed Header']
    @setHideBarOnScroll Conf['Header auto-hide on scroll']
    @setBarVisibility   Conf['Header auto-hide']

    $.sync 'Fixed Header',               @setBarFixed
    $.sync 'Header auto-hide on scroll', @setHideBarOnScroll
    $.sync 'Bottom Header',              @setBarPosition
    $.sync 'Header auto-hide',           @setBarVisibility

    @addShortcut menuButton

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
          el: customNavToggler
        ,
          el: editCustomNav
      ]

    $.on window, 'load hashchange', Header.hashScroll
    $.on d, 'CreateNotification', @createNotification

    @enableDesktopNotifications()
    @addShortcut menuButton, true

    $.asap (-> d.body), =>
      return unless Main.isThisPageLegit()
      # Wait for #boardNavMobile instead of #boardNavDesktop,
      # it might be incomplete otherwise.
      $.asap (-> $.id('boardNavMobile') or d.readyState isnt 'loading'), @setBoardList
      $.prepend d.body, @bar
      $.add d.body, @hover
      @setBarPosition Conf['Bottom Header']

    $.ready ->
      if a = $ "a[href*='/#{g.BOARD}/']", footer = $.id 'boardNavDesktopFoot'
        a.className = 'current'
      if Conf['JSON Navigation']
        $.on a, 'click', Navigate.navigate for a in $$ 'a', footer

  bar: $.el 'div',
    id: 'header-bar'

  noticesRoot: $.el 'div',
    id: 'notifications'

  stats: $.el 'span',
    id: 'a-stats'

  icons: $.el 'span',
    id: 'a-icons'

  hover: $.el 'div',
    id: 'hoverUI'

  toggle: $.el 'div',
    id: 'scroll-marker'

  initReady: ->
    Header.setBoardList()
    Header.addNav()

  setBoardList: ->
    fourchannav = $.id 'boardNavDesktop'
    Header.boardList = boardList = $.el 'span',
      id: 'board-list'
    $.extend boardList, <%= html(
      '<span id="custom-board-list"></span>' +
      '<span id="full-board-list" hidden>' +
        '<span class="hide-board-list-container brackets-wrap">' +
          '<a href="javascript:;" class="hide-board-list-button">&nbsp;-&nbsp;</a>' +
        '</span>' +
      '</span>'
    ) %>
      

    fullBoardList = $ '#full-board-list', boardList
    nodes = []
    for node in $('#boardNavDesktop > .boardList').childNodes
      switch node.nodeName
        when '#text'
          for chr in node.nodeValue when chr isnt ' '
            nodes.push $.tn chr
        when 'A'
          a = node.cloneNode true
          if Conf['JSON Navigation']
            $.on a, 'click', Navigate.navigate
          a.className = 'current' if a.pathname.split('/')[1] is g.BOARD.ID
          nodes.push a
    $.add fullBoardList, nodes
    fullBoardList.normalize()

    btn = $ '.hide-board-list-button', fullBoardList
    $.on btn, 'click', Header.toggleBoardList

    shortcuts = $.el 'span',
      id: 'shortcuts'

    $.add shortcuts, [Header.stats, Header.icons]

    $.prepend d.body, shortcuts

    $.add boardList, fullBoardList
    $.add Header.bar, [Header.boardList, Header.toggle]

    Header.setCustomNav Conf['Custom Board Navigation']
    Header.generateBoardList Conf['boardnav']

    $.sync 'Custom Board Navigation', Header.setCustomNav
    $.sync 'boardnav', Header.generateBoardList

  generateBoardList: (boardnav) ->
    list = $ '#custom-board-list', Header.boardList
    $.rmAll list
    return unless boardnav
    boardnav = boardnav.replace /(\r\n|\n|\r)/g, ' '
    as = $$ '#full-board-list a[title]', Header.boardList
    re = /[\w@]+(-(all|title|replace|full|index|catalog|archive|expired|(mode|sort|text|url):"[^"]+"(,"[^"]+")?))*|[^\w@]+/g
    nodes = (Header.mapCustomNavigation t, as for t in boardnav.match re)
    $.add list, nodes
    $.ready CatalogLinks.initBoardList

  mapCustomNavigation: (t, as) ->
    if /^[^\w@]/.test t
      return $.tn t

    text = '' 
    url  = ''
    t = t.replace /-text:"([^"]+)"(?:,"([^"]+)")?/g, (m0, m1, m2) ->
      text = m1
      url  = m2
      ''

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
      if a.hostname is 'boards.4chan.org' and a.pathname.split('/')[1] is g.BOARD.ID
        a.className += ' current'
      return a

    boardID = t.split('-')[0]
    boardID = g.BOARD.ID if boardID is 'current'
    for a in as when a.textContent is boardID
      a = a.cloneNode()
      break

    if Conf['JSON Navigation']
      $.on a, 'click', Navigate.navigate

    a.textContent = if /-title/.test(t) or /-replace/.test(t) and boardID is g.BOARD.ID
      a.title
    else if /-full/.test t
      "/#{boardID}/ - #{a.title}"
    else if m = t.match /-text:"([^"]+)"/
      m[1]
    else
      boardID

    if /-archive/.test t
      if href = Redirect.to 'board', {boardID}
        a.href = href
      else
        return a.firstChild # Its text node.

    if m = t.match /-mode:"([^"]+)"/
      type = m[1].toLowerCase()
      a.dataset.indexMode = switch type
        when 'all threads' then 'all pages'
        when 'paged', 'catalog' then type
        else 'paged'

    if m = t.match /-sort:"([^"]+)"/
      type = m[1].toLowerCase()
      a.dataset.indexSort = switch type
        when 'bump order'    then 'bump'
        when 'last reply'    then 'lastreply'
        when 'creation date' then 'birth'
        when 'reply count'   then 'replycount'
        when 'file count'    then 'filecount'
        else 'bump'

    $.addClass a, 'navSmall' if boardID is '@'
    a

  toggleBoardList: ->
    {bar}  = Header
    custom = $ '#custom-board-list', bar
    full   = $ '#full-board-list',   bar
    showBoardList = !full.hidden
    custom.hidden = !showBoardList
    full.hidden   =  showBoardList

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

  setBarVisibility: (hide) ->
    Header.headerToggler.checked = hide
    $.event 'CloseMenu'
    if hide
      $.addClass Header.bar, 'autohide'
      $.addClass doc, 'autohide'
    else
      $.rmClass Header.bar, 'autohide'
      $.rmClass doc, 'autohide'

  toggleBarVisibility: ->
    hide = if @nodeName is 'INPUT'
      @checked
    else
      !$.hasClass Header.bar, 'autohide'
    Conf['Header auto-hide'] = hide
    $.set 'Header auto-hide', hide
    Header.setBarVisibility hide
    # set checked status if called from keybind
    Header.headerToggler = hide
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
    $.rmClass Header.bar, 'autohide' unless Conf['Header auto-hide']

  toggleHideBarOnScroll: (e) ->
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
      'bottom'
    ] else [
      'top-header'
      'bottom-header'
      'top'
    ]

    $.addClass doc, args[0]
    $.rmClass  doc, args[1]
    Header.bar.parentNode.className = args[2]
    $.before Header.bar, Header.noticesRoot

  toggleBarPosition: ->
    $.cb.checked.call @
    Header.setBarPosition @checked

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

  hashScroll: ->
    hash = @location.hash[1..]
    return unless /^p\d+$/.test(hash) and post = $.id hash
    return if (Get.postFromRoot post).isHidden
    Header.scrollTo post

  scrollTo: (root, down, needed) ->
    if down
      x = Header.getBottomOf root
      if Conf['Header auto-hide on scroll'] and Conf['Bottom header']
        {height} = Header.bar.getBoundingClientRect()
        if x <= 0
          x += height if !Header.isHidden()
        else
          x -= height if  Header.isHidden()
      window.scrollBy 0, -x unless needed and x >= 0
    else
      x = Header.getTopOf root
      if Conf['Header auto-hide on scroll'] and !Conf['Bottom header']
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
      top     -= headRect.top + headRect.height - 10
    top

  getBottomOf: (root) ->
    {clientHeight} = doc
    bottom = clientHeight - root.getBoundingClientRect().bottom
    if Conf['Bottom Header']
      headRect = Header.toggle.getBoundingClientRect()
      bottom  -= clientHeight - headRect.bottom + headRect.height - 10
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

  addShortcut: (el, icon) ->
    $.addClass el, 'shortcut'
    $.add Header[if icon then 'icons' else 'stats'], el

  rmShortcut: (el, icon) ->
    $.rm if icon then el.parentElement else el

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
        '${g.NAME} needs your permission to show desktop notifications. ' +
        '[<a href="${g.FAQ}#why-is-4chan-x-asking-for-permission-to-show-desktop-notifications" target="_blank">FAQ</a>]<br>' +
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
