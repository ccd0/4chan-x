Header =
  init: ->
    headerEl = $.el 'div',
      id: 'header'
      innerHTML: """
      <%= grunt.file.read('html/General/Header.html').replace(/>\s+</g, '><').trim() %>
      """

    @bar    = $ '#header-bar', headerEl
    @toggle = $ '#toggle-header-bar', @bar

    @menu = new UI.Menu 'header'
    menuButton = $.el 'a',
      className: 'menu-button'
      innerHTML: '<i class=icon-reorder></i>'
      href: 'javascript:;'
    $.on menuButton, 'click', @menuToggle
    @addShortcut menuButton, 0
    $.on @toggle, 'mousedown', @toggleBarVisibility
    $.on window, 'load hashchange', Header.hashScroll
    $.on d, 'CreateNotification', @createNotification

    headerToggler = $.el 'label',
      innerHTML: '<input type=checkbox name="Header auto-hide"> Auto-hide header'
    barPositionToggler = $.el 'label',
      innerHTML: '<input type=checkbox name="Bottom header"> Bottom header'
    catalogToggler = $.el 'label',
      innerHTML: '<input type=checkbox name="Header catalog links"> Use catalog board links'
    topBoardToggler = $.el 'label',
      innerHTML: '<input type=checkbox name="Top Board List"> Top original board list'
    botBoardToggler = $.el 'label',
      innerHTML: '<input type=checkbox name="Bottom Board List"> Bottom original board list'
    customNavToggler = $.el 'label',
      innerHTML: '<input type=checkbox name="Custom Board Navigation"> Custom board navigation'
    editCustomNav = $.el 'a',
      textContent: 'Edit custom board navigation'
      href: 'javascript:;'

    @headerToggler      = headerToggler.firstElementChild
    @barPositionToggler = barPositionToggler.firstElementChild
    @catalogToggler     = catalogToggler.firstElementChild
    @topBoardToggler    = topBoardToggler.firstElementChild
    @botBoardToggler    = botBoardToggler.firstElementChild
    @customNavToggler   = customNavToggler.firstElementChild

    $.on @headerToggler,      'change', @toggleBarVisibility
    $.on @barPositionToggler, 'change', @toggleBarPosition
    $.on @catalogToggler,     'change', @toggleCatalogLinks
    $.on @topBoardToggler,    'change', @toggleOriginalBoardList
    $.on @botBoardToggler,    'change', @toggleOriginalBoardList
    $.on @customNavToggler,   'change', @toggleCustomNav
    $.on editCustomNav,       'click',  @editCustomNav

    @setBarVisibility Conf['Header auto-hide']
    @setBarPosition   Conf['Bottom header']
    @setTopBoardList  Conf['Top Board List']
    @setBotBoardList  Conf['Bottom Board List']

    $.sync 'Header auto-hide',  @setBarVisibility
    $.sync 'Bottom header',     @setBarPosition
    $.sync 'Top Board List',    @setTopBoardList
    $.sync 'Bottom Board List', @setBotBoardList

    $.event 'AddMenuEntry',
      type: 'header'
      el: $.el 'span', textContent: 'Header'
      order: 105
      subEntries: [
        {el: headerToggler}
        {el: barPositionToggler}
        {el: catalogToggler}
        {el: topBoardToggler}
        {el: botBoardToggler}
        {el: customNavToggler}
        {el: editCustomNav}
      ]

    $.asap (-> d.body), ->
      return unless Main.isThisPageLegit()
      # Wait for #boardNavMobile instead of #boardNavDesktop,
      # it might be incomplete otherwise.
      $.asap (-> $.id('boardNavMobile') or d.readyState isnt 'loading'), Header.setBoardList
      $.prepend d.body, headerEl

    $.ready ->
      if a = $ "a[href*='/#{g.BOARD}/']", $.id 'boardNavDesktopFoot'
        a.className = 'current'

      Header.setCatalogLinks Conf['Header catalog links']
      $.sync 'Header catalog links', Header.setCatalogLinks

    @enableDesktopNotifications()

  setBoardList: ->
    nav = $.id 'boardNavDesktop'
    if a = $ "a[href*='/#{g.BOARD}/']", nav
      a.className = 'current'
    fullBoardList = $ '#full-board-list', Header.bar
    fullBoardList.innerHTML = nav.innerHTML
    $.rm $ '#navtopright', fullBoardList
    btn = $.el 'span',
      className: 'hide-board-list-button brackets-wrap'
      innerHTML: '<a href=javascript:;> - </a>'
    $.on btn, 'click', Header.toggleBoardList
    $.add fullBoardList, btn

    Header.setCustomNav      Conf['Custom Board Navigation']
    Header.generateBoardList Conf['boardnav']

    $.sync 'Custom Board Navigation', Header.setCustomNav
    $.sync 'boardnav',                Header.generateBoardList

  generateBoardList: (text) ->
    list = $ '#custom-board-list', Header.bar
    $.rmAll list
    return unless text
    as = $$ '#full-board-list a[title]', Header.bar
    nodes = text.match(/[\w@]+(-(all|title|replace|full|index|catalog|text:"[^"]+"))*|[^\w@]+/g).map (t) ->
      if /^[^\w@]/.test t
        return $.tn t
      if /^toggle-all/.test t
        a = $.el 'a',
          className: 'show-board-list-button'
          textContent: (t.match(/-text:"(.+)"/) || [null, '+'])[1]
          href: 'javascript:;'
        $.on a, 'click', Header.toggleBoardList
        return a
      board = if /^current/.test t
        g.BOARD.ID
      else
        t.match(/^[^-]+/)[0]
      for a in as
        if a.textContent is board
          a = a.cloneNode true

          a.textContent = if /-title/.test(t) or /-replace/.test(t) and $.hasClass a, 'current'
            a.title
          else if /-full/.test t
            "/#{board}/ - #{a.title}"
          else if m = t.match /-text:"(.+)"/
            m[1]
          else
            a.textContent

          if m = t.match /-(index|catalog)/
            a.dataset.only = m[1]
            a.href = "//boards.4chan.org/#{board}/"
            a.href += 'catalog' if m[1] is 'catalog'

          $.addClass a, 'navSmall' if board is '@'
          return a
      $.tn t
    $.add list, nodes

  toggleBoardList: ->
    {bar}  = Header
    custom = $ '#custom-board-list', bar
    full   = $ '#full-board-list',   bar
    showBoardList = !full.hidden
    custom.hidden = !showBoardList
    full.hidden   =  showBoardList

  setBarVisibility: (hide) ->
    Header.headerToggler.checked = hide
    $.event 'CloseMenu'
    (if hide then $.addClass else $.rmClass) Header.bar, 'autohide'
  toggleBarVisibility: (e) ->
    return if e.type is 'mousedown' and e.button isnt 0 # not LMB
    hide = if @nodeName is 'INPUT'
      @checked
    else
      !$.hasClass Header.bar, 'autohide'
    Conf['Header auto-hide'] = hide
    $.set 'Header auto-hide', hide
    Header.setBarVisibility hide
    message = if hide
      'The header bar will automatically hide itself.'
    else
      'The header bar will remain visible.'
    new Notice 'info', message, 2

  setBarPosition: (bottom) ->
    Header.barPositionToggler.checked = bottom
    $.event 'CloseMenu'
    if bottom
      $.addClass doc, 'bottom-header'
      $.rmClass  doc, 'top-header'
      Header.bar.parentNode.className = 'bottom'
    else
      $.addClass doc, 'top-header'
      $.rmClass  doc, 'bottom-header'
      Header.bar.parentNode.className = 'top'
  toggleBarPosition: ->
    $.cb.checked.call @
    Header.setBarPosition @checked

  setCatalogLinks: (useCatalog) ->
    Header.catalogToggler.checked = useCatalog
    as = $$ [
      '#board-list a[href*="boards.4chan.org"]'
      '#boardNavDesktop a[href*="boards.4chan.org"]'
      '#boardNavDesktopFoot a[href*="boards.4chan.org"]'
    ].join ', '
    path = if useCatalog then 'catalog' else ''
    for a in as when not a.dataset.only
      a.pathname = "/#{a.pathname.split('/')[1]}/#{path}"
    return
  toggleCatalogLinks: ->
    $.cb.checked.call @
    Header.setCatalogLinks @checked

  setTopBoardList: (show) ->
    Header.topBoardToggler.checked = show
    if show
      $.addClass doc, 'show-original-top-board-list'
    else
      $.rmClass  doc, 'show-original-top-board-list'
  setBotBoardList: (show) ->
    Header.botBoardToggler.checked = show
    if show
      $.addClass doc, 'show-original-bot-board-list'
    else
      $.rmClass  doc, 'show-original-bot-board-list'
  toggleOriginalBoardList: ->
    $.cb.checked.call @
    (if @name is 'Top Board List' then Header.setTopBoardList else Header.setBotBoardList) @checked

  setCustomNav: (show) ->
    Header.customNavToggler.checked = show
    cust = $ '#custom-board-list', Header.bar
    full = $ '#full-board-list',   Header.bar
    btn  = $ '.hide-board-list-button', full
    [cust.hidden, full.hidden, btn.hidden] = if show
      [false, true, false]
    else
      [true, false, true]
  toggleCustomNav: ->
    $.cb.checked.call @
    Header.setCustomNav @checked

  editCustomNav: ->
    Settings.open 'Rice'
    settings = $.id 'fourchanx-settings'
    $('input[name=boardnav]', settings).focus()

  hashScroll: ->
    return unless (hash = @location.hash[1..]) and post = $.id hash
    return if (Get.postFromRoot post).isHidden
    Header.scrollToPost post
  scrollToPost: (post) ->
    {top} = post.getBoundingClientRect()
    unless Conf['Bottom header']
      headRect = Header.toggle.getBoundingClientRect()
      top -= headRect.top + headRect.height
    window.scrollBy 0, top

  addShortcut: (el, index) ->
    shortcut = $.el 'span',
      className: 'shortcut'
    $.add shortcut, el
    shortcuts = $ '#shortcuts', Header.bar
    nodes = [shortcuts.childNodes...]
    nodes.splice index, 0, shortcut
    $.add shortcuts, nodes

  menuToggle: (e) ->
    Header.menu.toggle e, @, g

  createNotification: (e) ->
    {type, content, lifetime, cb} = e.detail
    notif = new Notice type, content, lifetime
    cb notif if cb

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
      innerHTML: """
      Desktop notification permissions are not granted.
      [<a href='https://github.com/MayhemYDG/4chan-x/wiki/FAQ#desktop-notifications' target=_blank>FAQ</a>]<br>
      <button>Authorize</button> or <button>Disable</button>
      """
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
