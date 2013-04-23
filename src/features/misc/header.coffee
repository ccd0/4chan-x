Header =
  init: ->
    @menuButton = $.el 'span',
      className: 'menu-button'
      id:        'main-menu'

    @menu = new UI.Menu 'header'

    headerToggler = $.el 'label',
      innerHTML: '<input type=checkbox name="Header auto-hide"> Auto-hide header'

    @headerToggler   = headerToggler.firstElementChild

    $.on @menuButton,     'click',           @menuToggle
    $.on window,          'load hashchange', Header.hashScroll
    $.on @headerToggler,  'change',          @toggleBarVisibility

    {createSubEntry} = Header
    subEntries = []
    for setting in ['Sticky top', 'Sticky bottom', 'Top', 'Hide']
      subEntries.push createSubEntry setting

    subEntries.push {el: headerToggler}

    $.event 'AddMenuEntry',
      type: 'header'
      el: $.el 'span',
        textContent: 'Header'
      order: 105
      subEntries: subEntries

    $.on d, 'CreateNotification', @createNotification

    $.asap (-> d.body), ->
      return unless Main.isThisPageLegit()
      # Wait for #boardNavMobile instead of #boardNavDesktop,
      # it might be incomplete otherwise.
      $.asap (-> $.id 'boardNavMobile'), Header.setBoardList

    $.ready ->
      $.add d.body, Header.hover

  bar: $.el 'div',
    id: 'notifications'

  shortcuts: $.el 'span',
    id: 'shortcuts'

  hover: $.el 'div',
    id: 'hoverUI'

  toggle: $.el 'div',
    id: 'scroll-marker'

  createSubEntry: (setting) ->
    label = $.el 'label',
      textContent: "#{setting}"

    $.on label, 'click', Header.setBarPosition

    el: label

  setBoardList: ->
    Header.nav = nav = $.id 'boardNavDesktop'
    nav.id = 'header-bar'
    if a = $ "a[href*='/#{g.BOARD}/']", nav
      a.className = 'current'

    boardList = $.el 'span',
      id: 'board-list'

    $.add boardList, fullBoardList = $.el 'span',
      id: 'full-board-list'

    Header.setBarPosition.call textContent: "#{Conf['Boards Navigation']}"
    $.sync 'Boards Navigation', Header.changeBarPosition

    Header.setBarVisibility Conf['Header auto-hide']
    $.sync 'Header auto-hide',  Header.setBarVisibility

    $.prepend d.body, settings = $.id 'navtopright'
    $.add settings, Header.menuButton

    $.add fullBoardList, [nav.childNodes...]
    $.add nav, [boardList, Header.shortcuts, Header.bar, Header.toggle]

    if Conf['Custom Board Navigation']
      fullBoardList.hidden = true
      customBoardList = $.el 'span',
        id: 'custom-board-list'
      $.add boardList, customBoardList

      Header.generateBoardList Conf['boardnav']
      $.sync 'boardnav', Header.generateBoardList

      btn = $.el 'span',
        className: 'hide-board-list-button'
        innerHTML: '[<a href=javascript:;> - </a>]\u00A0'
      $.on btn, 'click', Header.toggleBoardList

      $.prepend fullBoardList, btn

    else
      fullBoardList.hidden = false

  generateBoardList: (text) ->
    list = $ '#custom-board-list', Header.nav
    $.rmAll list
    return unless text
    as = $$('#full-board-list a', Header.nav)[0...-2] # ignore the Settings and Home links
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
          if /-title/.test t
            a.textContent = a.title
          else if /-replace/.test t
            if $.hasClass a, 'current'
              a.textContent = a.title
          else if /-full/.test t
            a.textContent = "/#{board}/ - #{a.title}"
          else if /-(index|catalog|text)/.test t
            if m = t.match /-(index|catalog)/
              a.setAttribute 'data-only', m[1]
              a.href = "//boards.4chan.org/#{board}/"
              a.href += 'catalog' if m[1] is 'catalog'
            if m = t.match /-text:"(.+)"/
              a.textContent = m[1]
          else if board is '@'
            $.addClass a, 'navSmall'
          return a
      $.tn t
    $.add list, nodes

  toggleBoardList: ->
    {nav}  = Header
    custom = $ '#custom-board-list', nav
    full   = $ '#full-board-list',   nav
    showBoardList = !full.hidden
    custom.hidden = !showBoardList
    full.hidden   =  showBoardList

  setBarPosition: ->
    $.event 'CloseMenu'

    Header.changeBarPosition @textContent

    Conf['Boards Navigation'] = @textContent
    $.set 'Boards Navigation',  @textContent

  changeBarPosition: (setting) ->
    $.rmClass doc, 'top'
    $.rmClass doc, 'fixed'
    $.rmClass doc, 'bottom'
    $.rmClass doc, 'hide'
    switch setting
      when 'Sticky top'
        $.addClass doc, 'top'
        $.addClass doc, 'fixed'
      when 'Sticky bottom'
        $.addClass doc, 'fixed'
        $.addClass doc, 'bottom'
      when 'Top'
        $.addClass doc, 'top'
      when 'Hide'
        $.addClass doc, 'hide'

  setBarVisibility: (hide) ->
    Header.headerToggler.checked = hide
    $.event 'CloseMenu'
    (if hide then $.addClass else $.rmClass) Header.nav, 'autohide'

  hashScroll: ->
    return unless post = @location.hash[1..]
    return if (Get.postFromRoot post).isHidden
    Header.scrollToPost post

  scrollToPost: (post) ->
    {top} = post.getBoundingClientRect()
    if Conf['Boards Navigation'] is 'sticky top'
      headRect = Header.bar.getBoundingClientRect()
      top += - headRect.top - headRect.height
    <% if (type === 'crx') { %>d.body<% } else { %>doc<% } %>.scrollTop += top

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
    new Notification 'info', message, 2

  hashScroll: ->
    return unless (hash = @location.hash) and post = $.id hash[1..]
    return if (Get.postFromRoot post).isHidden
    Header.scrollToPost post

  scrollToPost: (post) ->
    {top} = post.getBoundingClientRect()
    if Conf['Boards Navigation'] is 'Sticky top'
      headRect = Header.bar.getBoundingClientRect()
      top += - headRect.top - headRect.height
    <% if (type === 'crx') { %>d.body<% } else { %>doc<% } %>.scrollTop += top

  addShortcut: (el) ->
    shortcut = $.el 'span',
      className: 'shortcut'
    $.add shortcut, [$.tn(' ['), el, $.tn(']')]
    $.prepend Header.shortcuts, shortcut

  menuToggle: (e) ->
    Header.menu.toggle e, @, g

  createNotification: (e) ->
    {type, content, lifetime, cb} = e.detail
    notif = new Notification type, content, lifetime
    cb notif if cb