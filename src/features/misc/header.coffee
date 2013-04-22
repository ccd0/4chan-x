Header =
  init: ->
    @menuButton = $.el 'span',
      className: 'menu-button'
      innerHTML: '<a class=brackets-wrap href=javascript:;><i></i></a>'

    @menu = new UI.Menu 'header'
    $.on @menuButton, 'click',           @menuToggle
    $.on @toggle,     'mousedown',       @toggleBarVisibility
    $.on window,      'load hashchange', Header.hashScroll

    @positionToggler = $.el 'span',
      textContent: 'Header Position'
      className:   'header-position-link'

    {createSubEntry} = Header
    subEntries = []
    for setting in ['sticky top', 'sticky bottom', 'top']
      subEntries.push createSubEntry setting

    $.event 'AddMenuEntry',
      type:  'header'
      el:    @positionToggler
      order: 108
      subEntries: subEntries

    @headerToggler = $.el 'label',
      innerHTML: "<input type=checkbox #{if Conf['Header auto-hide'] then 'checked' else ''}> Auto-hide header"
    $.on @headerToggler.firstElementChild, 'change', @toggleBarVisibility

    $.event 'AddMenuEntry',
      type:  'header'
      el:    @headerToggler
      order: 109

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
    id: 'toggle-header-bar'
  
  settings: $.el 'div',
    id: 'settingsContainer'

  createSubEntry: (setting)->
    label = $.el 'label',
      textContent: "#{setting}"

    $.on label, 'click', Header.setBarPosition

    el: label

  setBoardList: ->
    Header.nav = nav = $.id 'boardNavDesktop'
    if a = $ "a[href*='/#{g.BOARD}/']", nav
      a.className = 'current'

    fullBoardList = $.el 'span',
      id:     'full-board-list'

    Header.setBarPosition.call textContent: "#{Conf['Boards Navigation']}"
    $.sync 'Boards Navigation', Header.changeBarPosition

    Header.setBarVisibility Conf['Header auto-hide']
    $.sync 'Header auto-hide',  Header.setBarVisibility

    $.add fullBoardList, [nav.childNodes...]
    $.add nav, [Header.menuButton, fullBoardList, Header.shortcuts, Header.bar, Header.toggle, Header.settings]

    if Conf['Custom Board Navigation']
      fullBoardList.hidden = true
      customBoardList = $.el 'span',
        id:     'custom-board-list'

      Header.generateBoardList Conf['boardnav']
      $.sync 'boardnav', Header.generateBoardList

      btn = $.el 'span',
        className: 'hide-board-list-button'
        innerHTML: '[<a href=javascript:;> - </a>]\u00A0'
      $.on btn, 'click', Header.toggleBoardList

      $.prepend fullBoardList, btn
      $.before fullBoardList, customBoardList

    else
      fullBoardList.hidden = false

  generateBoardList: (text) ->
    unless list = $ '#custom-board-list', Header.nav
      # init'd with the custom board list disabled.
      return
    $.rmAll list
    return unless text
    as = $$('#full-board-list a', Header.nav)[0...-2] # ignore the Settings and Home links
    nodes = text.match(/[\w@]+(-(all|title|full|index|catalog|text:"[^"]+"))*|[^\w@]+/g).map (t) ->
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
    $.rmClass  doc, 'top'
    $.rmClass  doc, 'fixed'
    $.rmClass  doc, 'bottom'
    $.rmClass  Header.nav, 'dialog'
    switch setting
      when 'sticky top'
        $.addClass doc, 'top'
        $.addClass doc, 'fixed'
        $.addClass Header.nav, 'dialog'
      when 'sticky bottom'
        $.addClass doc, 'fixed'
        $.addClass doc, 'bottom'
        $.addClass Header.nav, 'dialog'
      when 'top'
        $.addClass doc, 'top'

  setBarVisibility: (hide) ->
    Header.headerToggler.firstElementChild.checked = hide
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
    (if $.engine is 'webkit' then d.body else doc).scrollTop += top

  toggleBarVisibility: (e) ->
    return if e.type is 'mousedown' and e.button isnt 0 # not LMB
    hide = if @nodeName is 'INPUT'
      @checked
    else
      !$.hasClass Header.nav, 'autohide'
    Header.setBarVisibility hide
    message = if hide
      'The header bar will automatically hide itself.'
    else
      'The header bar will remain visible.'
    new Notification 'info', message, 2
    $.set 'Header auto-hide', hide

  addShortcut: (el) ->
    shortcut = $.el 'span',
      className: 'shortcut'
    $.add shortcut, [$.tn(' ['), el, $.tn(']')]
    $.add Header.shortcuts, shortcut

  menuToggle: (e) ->
    Header.menu.toggle e, @, g

  createNotification: (e) ->
    {type, content, lifetime, cb} = e.detail
    notif = new Notification type, content, lifetime
    cb notif if cb