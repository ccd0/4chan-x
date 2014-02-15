Header =
  init: ->
    headerEl = $.el 'div',
      id: 'header'
      innerHTML: <%= importHTML('General/Header') %>

    @bar    = $ '#header-bar', headerEl
    @toggle = $ '#toggle-header-bar', @bar
    @noticesRoot = $ '#notifications', headerEl

    @menu = new UI.Menu 'header'
    menuButton = $.el 'a',
      className: 'menu-button'
      innerHTML: '<i class="fa fa-bars"></i>'
      href: 'javascript:;'
    $.on menuButton, 'click', @menuToggle
    @addShortcut menuButton, 0
    $.on @toggle, 'mousedown', @toggleBarVisibility
    $.on window, 'load hashchange', Header.hashScroll
    $.on d, 'CreateNotification', @createNotification

    headerToggler = $.el 'label',
      innerHTML: '<input type=checkbox name="Header auto-hide"> Auto-hide header'
    scrollHeaderToggler = $.el 'label',
      innerHTML: '<input type=checkbox name="Header auto-hide on scroll"> Auto-hide header on scroll'
    barPositionToggler = $.el 'label',
      innerHTML: '<input type=checkbox name="Bottom header"> Bottom header'
    topBoardToggler = $.el 'label',
      innerHTML: '<input type=checkbox name="Top Board List"> Top original board list'
    botBoardToggler = $.el 'label',
      innerHTML: '<input type=checkbox name="Bottom Board List"> Bottom original board list'
    customNavToggler = $.el 'label',
      innerHTML: '<input type=checkbox name="Custom Board Navigation"> Custom board navigation'
    editCustomNav = $.el 'a',
      textContent: 'Edit custom board navigation'
      href: 'javascript:;'

    @headerToggler       = headerToggler.firstElementChild
    @scrollHeaderToggler = scrollHeaderToggler.firstElementChild
    @barPositionToggler  = barPositionToggler.firstElementChild
    @topBoardToggler     = topBoardToggler.firstElementChild
    @botBoardToggler     = botBoardToggler.firstElementChild
    @customNavToggler    = customNavToggler.firstElementChild

    $.on @headerToggler,       'change', @toggleBarVisibility
    $.on @scrollHeaderToggler, 'change', @toggleHideBarOnScroll
    $.on @barPositionToggler,  'change', @toggleBarPosition
    $.on @topBoardToggler,     'change', @toggleOriginalBoardList
    $.on @botBoardToggler,     'change', @toggleOriginalBoardList
    $.on @customNavToggler,    'change', @toggleCustomNav
    $.on editCustomNav,        'click',  @editCustomNav

    @setBarVisibility   Conf['Header auto-hide']
    @setHideBarOnScroll Conf['Header auto-hide on scroll']
    @setBarPosition     Conf['Bottom header']
    @setTopBoardList    Conf['Top Board List']
    @setBotBoardList    Conf['Bottom Board List']

    $.sync 'Header auto-hide',           @setBarVisibility
    $.sync 'Header auto-hide on scroll', @setHideBarOnScroll
    $.sync 'Bottom header',              @setBarPosition
    $.sync 'Top Board List',             @setTopBoardList
    $.sync 'Bottom Board List',          @setBotBoardList

    $.event 'AddMenuEntry',
      type: 'header'
      el: $.el 'span', textContent: 'Header'
      order: 105
      subEntries: [
        {el: headerToggler}
        {el: scrollHeaderToggler}
        {el: barPositionToggler}
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
    as = $$ '.boardList a[title]', Header.bar
    re = /[\w@]+(-(all|title|replace|full|archive|(mode|sort|text):"[^"]+"))*|[^\w@]+/g
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

      boardID = t.split('-')[0]
      boardID = g.BOARD.ID if boardID is 'current'
      for a in as when a.textContent is boardID
        a = a.cloneNode()
        break
      return $.tn boardID if a.parentNode # Not a clone.

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

  setHideBarOnScroll: (hide) ->
    Header.scrollHeaderToggler.checked = hide
    if hide
      $.on window, 'scroll', Header.hideBarOnScroll
      return
    $.off window, 'scroll', Header.hideBarOnScroll
    $.rmClass Header.bar, 'scroll'
    $.rmClass Header.bar, 'autohide' unless Conf['Header auto-hide']
  toggleHideBarOnScroll: ->
    $.cb.checked.call @
    Header.setHideBarOnScroll @checked
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
    unless Conf['Bottom header']
      headRect = Header.toggle.getBoundingClientRect()
      top     -= headRect.top + headRect.height
    top
  getBottomOf: (root) ->
    {clientHeight} = doc
    bottom = clientHeight - root.getBoundingClientRect().bottom
    if Conf['Bottom header']
      headRect = Header.toggle.getBoundingClientRect()
      bottom  -= clientHeight - headRect.bottom + headRect.height
    bottom
  isHidden: ->
    {top} = Header.bar.getBoundingClientRect()
    if Conf['Bottom header']
      top is doc.clientHeight
    else
      top < 0

  addShortcut: (el, index) ->
    shortcut = $.el 'span',
      className: 'shortcut'
    shortcut.dataset.index = index
    $.add shortcut, el
    shortcuts = $ '#shortcuts', Header.bar
    $.add shortcuts, [shortcuts.childNodes...].concat(shortcut).sort (a, b) -> a.dataset.index - b.dataset.index

  menuToggle: (e) ->
    Header.menu.toggle e, @, g

  createNotification: (e) ->
    {type, content, lifetime, cb} = e.detail
    notice = new Notice type, content, lifetime
    cb notice if cb

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
