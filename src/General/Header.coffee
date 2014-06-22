Header =
  init: ->
    @menu = new UI.Menu()

    menuButton = $.el 'a',
      className: 'menu-button'
      innerHTML: '<i></i>'

    barFixedToggler  = $.el 'label',
      innerHTML: '<input type=checkbox name="Fixed Header"> Fixed Header'
    headerToggler = $.el 'label',
      innerHTML: '<input type=checkbox name="Header auto-hide"> Auto-hide header'
    scrollHeaderToggler = $.el 'label',
      innerHTML: '<input type=checkbox name="Header auto-hide on scroll"> Auto-hide header on scroll'
    barPositionToggler = $.el 'label',
      innerHTML: '<input type=checkbox name="Bottom Header"> Bottom header'
    linkJustifyToggler = $.el 'label',
      innerHTML: "<input type=checkbox #{if Conf['Centered links'] then 'checked' else ''}> Centered links"
    customNavToggler = $.el 'label',
      innerHTML: '<input type=checkbox name="Custom Board Navigation"> Custom board navigation'
    footerToggler = $.el 'label',
      innerHTML: "<input type=checkbox #{unless Conf['Bottom Board List'] then 'checked' else ''}> Hide bottom board list"
    shortcutToggler = $.el 'label',
      innerHTML: "<input type=checkbox #{unless Conf['Shortcut Icons'] then 'checked' else ''}> Shortcut Icons"
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
    $.on @headerToggler,       'change', @toggleBarVisibility
    $.on @footerToggler,       'change', @toggleFooterVisibility
    $.on @shortcutToggler,     'change', @toggleShortcutIcons
    $.on @customNavToggler,    'change', @toggleCustomNav
    $.on editCustomNav,        'click',  @editCustomNav

    @setBarFixed        Conf['Fixed Header']
    @setHideBarOnScroll Conf['Header auto-hide on scroll']
    @setBarVisibility   Conf['Header auto-hide']
    @setLinkJustify     Conf['Centered links']
    @setShortcutIcons   Conf['Shortcut Icons']

    $.sync 'Fixed Header',               @setBarFixed
    $.sync 'Header auto-hide on scroll', @setHideBarOnScroll
    $.sync 'Bottom Header',              @setBarPosition
    $.sync 'Shortcut Icons',             @setShortcutIcons
    $.sync 'Header auto-hide',           @setBarVisibility
    $.sync 'Centered links',             @setLinkJustify

    @addShortcut menuButton

    @menu.addEntry
      el: $.el 'span', textContent: 'Header'
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

    $.on window, 'load hashchange', Header.hashScroll
    $.on d, 'CreateNotification', @createNotification

    $.asap (-> d.body), =>
      return unless Main.isThisPageLegit()
      # Wait for #boardNavMobile instead of #boardNavDesktop,
      # it might be incomplete otherwise.
      $.asap (-> $.id('boardNavMobile') or d.readyState isnt 'loading'), Header.setBoardList
      $.prepend d.body, @bar
      $.add d.body, Header.hover
      @setBarPosition Conf['Bottom Header']
      @

    $.ready =>
      @footer = footer = $.id 'boardNavDesktopFoot'
      if Conf['JSON Navigation']
        $.on a, 'click', Navigate.navigate for a in $$ 'a', footer
      if a = $ "a[href*='/#{g.BOARD}/']", footer
        a.className = 'current'

      cs = $.el 'a',
        href: 'javascript:;'
        textContent: 'Catalog Settings'
      $.on cs, 'click', () ->
        $.id('settingsWindowLink').click()

      @addShortcut cs if g.VIEW is 'catalog'

      Header.setFooterVisibility Conf['Bottom Board List']
      $.sync 'Bottom Board List', Header.setFooterVisibility

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

  initReady: ->
    Header.setBoardList()
    Header.addNav()

  setBoardList: ->
    fourchannav = $.id 'boardNavDesktop'
    Header.boardList = boardList = $.el 'span',
      id: 'board-list'
      innerHTML: "<span id=custom-board-list></span><span id=full-board-list hidden><span class='hide-board-list-container brackets-wrap'><a href=javascript:; class='hide-board-list-button'>&nbsp;-&nbsp;</a></span> #{fourchannav.innerHTML}</span>"

    for a in $$ 'a', boardList
      if Conf['JSON Navigation']
        $.on a, 'click', Navigate.navigate
      if a.pathname.split('/')[1] is g.BOARD.ID
        a.className = 'current'
    fullBoardList = $ '#full-board-list', boardList
    btn = $ '.hide-board-list-button', fullBoardList
    $.on btn, 'click', Header.toggleBoardList

    $.rm $ '#navtopright', fullBoardList
    $.add boardList, fullBoardList
    $.add Header.bar, [Header.boardList, Header.shortcuts, Header.noticesRoot, Header.toggle]

    Header.setCustomNav Conf['Custom Board Navigation']
    Header.generateBoardList Conf['boardnav'].replace /(\r\n|\n|\r)/g, ' '

    $.sync 'Custom Board Navigation', Header.setCustomNav
    $.sync 'boardnav', Header.generateBoardList

  generateBoardList: (text) ->
    list = $ '#custom-board-list', Header.boardList
    $.rmAll list
    return unless text
    as = $$ '#full-board-list a[title]', Header.boardList
    re = /[\w@]+(-(all|title|replace|full|archive|(mode|sort|text|url):"[^"]+"(\,"[^"]+[^"]")?))*|[^\w@]+/g
    nodes = text.match(re).map (t) ->
      if /^[^\w@]/.test t
        return $.tn t

      if /^toggle-all/.test t
        a = $.el 'a',
          className: 'show-board-list-button'
          textContent: (t.match(/-text:"(.+)"/) || [null, '+'])[1]
          href: 'javascript:;'
        $.on a, 'click', Header.toggleBoardList
        return a

      if /^external/.test t
        a = $.el 'a',
          href: (t.match(/\,"(.+)"/) || [null, '+'])[1]
          textContent: (t.match(/-text:"(.+)"\,/) || [null, '+'])[1]
          className: 'external'
        return a

      board = if /^current/.test t
        g.BOARD.ID
      else
        t.match(/^[^-]+/)[0]

      boardID = t.split('-')[0]
      boardID = g.BOARD.ID if boardID is 'current'
      for a in as when a.textContent is boardID
        a = a.cloneNode()
        break
      return $.tn boardID if a.parentNode # Not a clone.

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

    $.add list, nodes

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
    (if hide then $.addClass else $.rmClass) Header.bar, 'autohide'

  toggleBarVisibility: (e) ->
    hide = @checked
    Conf['Header auto-hide'] = hide
    $.set 'Header auto-hide', hide
    Header.setBarVisibility hide

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
      'after'
    ] else [
      'top-header'
      'bottom-header'
      'top'
      'add'
    ]

    $.addClass doc, args[0]
    $.rmClass  doc, args[1]
    Header.bar.parentNode.className = args[2]
    $[args[3]] Header.bar, Header.noticesRoot

  toggleBarPosition: ->
    $.cb.checked.call @
    Header.setBarPosition @checked

  setFooterVisibility: (hide) ->
    Header.footerToggler.checked = hide
    Header.footer.hidden = hide

  toggleFooterVisibility: ->
    $.event 'CloseMenu'
    hide = if @nodeName is 'INPUT'
      @checked

  setCustomNav: (show) ->
    Header.customNavToggler.checked = show
    cust = $ '#custom-board-list', Header.bar
    full = $ '#full-board-list',   Header.bar
    btn = $ '.hide-board-list-button', full
    [cust.hidden, full.hidden] = if show
      [false, true]
    else
      [true, false]

  toggleCustomNav: ->
    $.cb.checked.call @
    Header.setCustomNav @checked

  editCustomNav: ->
    Settings.open 'Advanced'
    settings = $.id 'fourchanx-settings'
    $('input[name=boardnav]', settings).focus()

  hashScroll: ->
    hash = @location.hash[1..]
    return unless /^p\d+$/.test(hash) and post = $.id hash
    return if (Get.postFromNode post).isHidden
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
      top     -= headRect.top + headRect.height
    top

  getBottomOf: (root) ->
    {clientHeight} = doc
    bottom = clientHeight - root.getBoundingClientRect().bottom
    if Conf['Bottom Header']
      headRect = Header.toggle.getBoundingClientRect()
      bottom  -= clientHeight - headRect.bottom + headRect.height
    bottom
  isNodeVisible: (node) ->
    {height} = node.getBoundingClientRect()
    Header.getTopOf(node) + height >= 0 and Header.getBottomOf(node) + height >= 0
  isHidden: ->
    {top} = Header.bar.getBoundingClientRect()
    if Conf['Bottom header']
      top is doc.clientHeight
    else
      top < 0

  addShortcut: (el) ->
    shortcut = $.el 'span',
      className: 'shortcut brackets-wrap'
    $.add shortcut, el
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
