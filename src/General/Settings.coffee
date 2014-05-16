Settings =
  init: ->
    # 4chan X settings link
    link = $.el 'a',
      className:   'settings-link fa fa-wrench'
      textContent: 'Settings'
      title: '4chan X Settings'
      href:        'javascript:;'
    $.on link, 'click', Settings.open

    Header.addShortcut link

    Settings.addSection 'Main',     Settings.main
    Settings.addSection 'Filter',   Settings.filter
    Settings.addSection 'Sauce',    Settings.sauce
    Settings.addSection 'Advanced', Settings.advanced
    Settings.addSection 'Keybinds', Settings.keybinds

    $.on d, 'AddSettingsSection',   Settings.addSection
    $.on d, 'OpenSettings',         (e) -> Settings.open e.detail

    settings = JSON.parse(localStorage.getItem '4chan-settings') or {}
    return if settings.disableAll
    settings.disableAll = true
    localStorage.setItem '4chan-settings', JSON.stringify settings

  open: (openSection) ->
    return if Settings.dialog
    $.event 'CloseMenu'

    Settings.overlay = overlay = $.el 'div',
      id: 'overlay'

    Settings.dialog = dialog = $.el 'div',
      id:        'fourchanx-settings'
      className: 'dialog'
      innerHTML: <%= importHTML('Settings/Settings') %>

    $.on $('.export', Settings.dialog), 'click',  Settings.export
    $.on $('.import', Settings.dialog), 'click',  Settings.import
    $.on $('.reset',  Settings.dialog), 'click',  Settings.reset
    $.on $('input',   Settings.dialog), 'change', Settings.onImport

    links = []
    for section in Settings.sections
      link = $.el 'a',
        className: "tab-#{section.hyphenatedTitle}"
        textContent: section.title
        href: 'javascript:;'
      $.on link, 'click', Settings.openSection.bind section
      links.push link, $.tn ' | '
      sectionToOpen = link if section.title is openSection
    links.pop()
    $.add $('.sections-list', dialog), links
    (if sectionToOpen then sectionToOpen else links[0]).click()

    $.on $('.close', dialog), 'click', Settings.close
    $.on overlay,             'click', Settings.close

    $.add d.body, [overlay, dialog]

    $.event 'OpenSettings', null, dialog

  close: ->
    return unless Settings.dialog
    $.rm Settings.overlay
    $.rm Settings.dialog
    delete Settings.overlay
    delete Settings.dialog

  sections: []
  addSection: (title, open) ->
    if typeof title isnt 'string'
      {title, open} = title.detail
    hyphenatedTitle = title.toLowerCase().replace /\s+/g, '-'
    Settings.sections.push {title, hyphenatedTitle, open}
  openSection: ->
    if selected = $ '.tab-selected', Settings.dialog
      $.rmClass selected, 'tab-selected'
    $.addClass $(".tab-#{@hyphenatedTitle}", Settings.dialog), 'tab-selected'
    section = $ 'section', Settings.dialog
    $.rmAll section
    section.className = "section-#{@hyphenatedTitle}"
    @open section, g
    section.scrollTop = 0
    $.event 'OpenSettings', null, section

  main: (section) ->
    items  = {}
    inputs = {}
    for key, obj of Config.main
      fs = $.el 'fieldset',
        innerHTML: '<legend></legend>'
      fs.firstElementChild.textContent = key
      for key, arr of obj
        description = arr[1]
        div = $.el 'div'
        $.add div, [
          UI.checkbox key, key, false
          $.el 'span', class: 'description', textContent: ": #{description}"
        ]
        input = $ 'input', div
        $.on input, 'change', $.cb.checked
        items[key]  = Conf[key]
        inputs[key] = input
        $.add fs, div
      $.add section, fs

    $.get items, (items) ->
      for key, val of items
        inputs[key].checked = val
      return

    div = $.el 'div',
      innerHTML: '<button></button><span class=description>: Clear manually-hidden threads and posts on all boards. Reload the page to apply.'
    button = $ 'button', div
    $.get {hiddenThreads: {}, hiddenPosts: {}}, ({hiddenThreads, hiddenPosts}) ->
      hiddenNum = 0
      for ID, board of hiddenThreads.boards
        hiddenNum += Object.keys(board).length
      for ID, board of hiddenPosts.boards
        for ID, thread of board
          hiddenNum += Object.keys(thread).length
      button.textContent = "Hidden: #{hiddenNum}"
    $.on button, 'click', ->
      @textContent = 'Hidden: 0'
      $.get 'hiddenThreads', {}, ({hiddenThreads}) ->
        for boardID of hiddenThreads.boards
          localStorage.removeItem "4chan-hide-t-#{boardID}"
        $.delete ['hiddenThreads', 'hiddenPosts']
    $.after $('input[name="Stubs"]', section).parentNode.parentNode, div
  export: ->
    # Make sure to export the most recent data.
    $.get Conf, (Conf) ->
      # XXX don't export archives.
      delete Conf['archives']
      Settings.downloadExport {version: g.VERSION, date: Date.now(), Conf}
  downloadExport: (data) ->
    a = $.el 'a',
      download: "<%= meta.name %> v#{g.VERSION}-#{data.date}.json"
      href: "data:application/json;base64,#{btoa unescape encodeURIComponent JSON.stringify data, null, 2}"
    <% if (type === 'userscript') { %>
    p = $ '.imp-exp-result', Settings.dialog
    $.rmAll p
    $.add p, a
    <% } %>
    a.click()
  import: ->
    $('input', @parentNode).click()
  onImport: ->
    return unless file = @files[0]
    output = $('.imp-exp-result')
    unless confirm 'Your current settings will be entirely overwritten, are you sure?'
      output.textContent = 'Import aborted.'
      return
    reader = new FileReader()
    reader.onload = (e) ->
      try
        Settings.loadSettings JSON.parse e.target.result
        if confirm 'Import successful. Reload now?'
          window.location.reload()
      catch err
        output.textContent = 'Import failed due to an error.'
        c.error err.stack
    reader.readAsText file
  loadSettings: (data) ->
    version = data.version.split '.'
    if version[0] is '2'
      convertSettings = (data, map) ->
        for prevKey, newKey of map
          data.Conf[newKey] = data.Conf[prevKey] if newKey
          delete data.Conf[prevKey]
        data
      data = Settings.convertSettings data,
        # General confs
        'Disable 4chan\'s extension': ''
        'Catalog Links': ''
        'Reply Navigation': ''
        'Show Stubs': 'Stubs'
        'Image Auto-Gif': 'Auto-GIF'
        'Expand From Current': ''
        'Unread Tab Icon': 'Unread Favicon'
        'Post in Title': 'Thread Excerpt'
        'Auto Hide QR': ''
        'Open Reply in New Tab': ''
        'Remember QR size': ''
        'Quote Inline': 'Quote Inlining'
        'Quote Preview': 'Quote Previewing'
        'Indicate OP quote': 'Mark OP Quotes'
        'Indicate Cross-thread Quotes': 'Mark Cross-thread Quotes'
        'Reply Hiding': 'Reply Hiding Buttons'
        'Thread Hiding': 'Thread Hiding Buttons'
        # filter
        'uniqueid': 'uniqueID'
        'mod': 'capcode'
        'country': 'flag'
        'md5': 'MD5'
        # keybinds
        'openEmptyQR': 'Open empty QR'
        'openQR': 'Open QR'
        'openOptions': 'Open settings'
        'close': 'Close'
        'spoiler': 'Spoiler tags'
        'code': 'Code tags'
        'submit': 'Submit QR'
        'watch': 'Watch'
        'update': 'Update'
        'unreadCountTo0': ''
        'expandAllImages': 'Expand images'
        'expandImage': 'Expand image'
        'zero': 'Front page'
        'nextPage': 'Next page'
        'previousPage': 'Previous page'
        'nextThread': 'Next thread'
        'previousThread': 'Previous thread'
        'expandThread': 'Expand thread'
        'openThreadTab': 'Open thread'
        'openThread': 'Open thread tab'
        'nextReply': 'Next reply'
        'previousReply': 'Previous reply'
        'hide': 'Hide'
        # updater
        'Scrolling': 'Auto Scroll'
        'Verbose': ''
      data.Conf.sauces = data.Conf.sauces.replace /\$\d/g, (c) ->
        switch c
          when '$1'
            '%TURL'
          when '$2'
            '%URL'
          when '$3'
            '%MD5'
          when '$4'
            '%board'
          else
            c
      for key, val of Config.hotkeys when key of data.Conf
        data.Conf[key] = data.Conf[key].replace(/ctrl|alt|meta/g, (s) -> "#{s[0].toUpperCase()}#{s[1..]}").replace /(^|.+\+)[A-Z]$/g, (s) ->
          "Shift+#{s[0...-1]}#{s[-1..].toLowerCase()}"
      data.Conf['WatchedThreads'] = data.WatchedThreads
    if data.Conf['WatchedThreads']
      data.Conf['watchedThreads'] = boards: ThreadWatcher.convert data.Conf['WatchedThreads']
      delete data.Conf['WatchedThreads']
    $.set data.Conf
  reset: ->
    if confirm 'Your current settings will be entirely wiped, are you sure?'
      $.clear -> window.location.reload() if confirm 'Reset successful. Reload now?'

  filter: (section) ->
    section.innerHTML = <%= importHTML('Settings/Filter-select') %>
    select = $ 'select', section
    $.on select, 'change', Settings.selectFilter
    Settings.selectFilter.call select

  selectFilter: ->
    div = @nextElementSibling
    if (name = @value) isnt 'guide'
      $.rmAll div
      ta = $.el 'textarea',
        name: name
        className: 'field'
        spellcheck: false
      $.get name, Conf[name], (item) ->
        ta.value = item[name]
      $.on ta, 'change', $.cb.value
      $.add div, ta
      return
    div.innerHTML = <%= importHTML('Settings/Filter-guide') %>
    $('.warning', div).hidden = Conf['Filter']

  sauce: (section) ->
    section.innerHTML = <%= importHTML('Settings/Sauce') %>
    $('.warning', section).hidden = Conf['Sauce']
    ta = $ 'textarea', section
    $.get 'sauces', Conf['sauces'], (item) ->
      ta.value = item['sauces']
    $.on ta, 'change', $.cb.value

  advanced: (section) ->
    section.innerHTML = <%= importHTML('Settings/Advanced') %>
    warning.hidden = Conf[warning.dataset.feature] for warning in $$ '.warning', section

    items = {}
    inputs = {}
    for name in ['boardnav', 'time', 'backlink', 'fileInfo', 'favicon', 'sageEmoji', 'emojiPos', 'usercss']
      input = $ "[name=#{name}]", section
      items[name]  = Conf[name]
      inputs[name] = input
      event = if name in ['favicon', 'usercss', 'sageEmoji', 'emojiPos']
        'change'
      else
        'input'
      $.on input, event, $.cb.value

    # Quick Reply Personas
    ta = $ '.personafield', section
    $.get 'QR.personas', Conf['QR.personas'], (item) ->
      ta.value = item['QR.personas']
    $.on ta, 'change', $.cb.value

    $.get items, (items) ->
      for key, val of items
        continue if key is 'emojiPos'
        input = inputs[key]
        input.value = val
        continue if key is 'usercss'
        $.on input, event, Settings[key]
        Settings[key].call input
      return

    interval  = $ 'input[name="Interval"]',   section
    customCSS = $ 'input[name="Custom CSS"]', section
    interval.value             =  Conf['Interval']
    customCSS.checked          =  Conf['Custom CSS']
    inputs['usercss'].disabled = !Conf['Custom CSS']
    $.on interval,          'change', ThreadUpdater.cb.interval
    $.on customCSS,         'change', Settings.togglecss
    $.on $.id('apply-css'), 'click',  Settings.usercss

    archBoards = {}
    for {name, boards, files, software, withCredentials} in Redirect.archives
      for boardID in boards
        o = archBoards[boardID] or=
          thread: [[], []]
          post:   [[], []]
          file:   [[], []]
        i = +!!withCredentials
        o.thread[i].push name
        o.post[i].push   name if software is 'foolfuuka'
        o.file[i].push   name if boardID in files
    for boardID, o of archBoards
      for item in ['thread', 'post', 'file']
        if o[item][0].length is 0 and o[item][1].length isnt 0
          o[item][0].push 'disabled'
        o[item] = o[item][0].concat(o[item][1])

    rows = []
    boardOptions = []
    for boardID in Object.keys(archBoards).sort() # Alphabetical order
      row = $.el 'tr',
        className: "board-#{boardID}"
      row.hidden = boardID isnt g.BOARD.ID

      boardOptions.push $.el 'option',
        textContent: "/#{boardID}/"
        value:       "board-#{boardID}"
        selected:    boardID is g.BOARD.ID

      o = archBoards[boardID]
      $.add row, Settings.addArchiveCell boardID, o, item for item in ['thread', 'post', 'file']
      rows.push row

    $.add $('tbody', section), rows

    boardSelect = $('#archive-board-select', section)
    $.add boardSelect, boardOptions
    table = $.id 'archive-table'
    $.on boardSelect, 'change', ->
      $('tbody > :not([hidden])', table).hidden = true
      $("tbody > .#{@value}", table).hidden = false

    $.get 'selectedArchives', Conf['selectedArchives'], ({selectedArchives}) ->
      for boardID, data of selectedArchives
        for type, name of data
          if option = $ "select[data-boardid='#{boardID}'][data-type='#{type}'] > option[value='#{name}']", section
            option.selected = true
      return
    return

  addArchiveCell: (boardID, data, type) ->
    {length} = data[type]
    td = $.el 'td',
      className: 'archive-cell'

    unless length
      td.textContent = '--'
      return td

    options = []
    i = 0
    while i < length
      archive = data[type][i++]
      options.push $.el 'option',
        textContent: archive
        value: archive

    td.innerHTML = '<select></select>'
    select = td.firstElementChild
    unless select.disabled = length is 1
      # XXX GM can't into datasets
      select.setAttribute 'data-boardid', boardID
      select.setAttribute 'data-type', type
      $.on select, 'change', Settings.saveSelectedArchive
    $.add select, options

    td

  saveSelectedArchive: ->
    $.get 'selectedArchives', Conf['selectedArchives'], ({selectedArchives}) =>
      (selectedArchives[@dataset.boardid] or= {})[@dataset.type] = @value
      $.set 'selectedArchives', selectedArchives

  boardnav: ->
    Header.generateBoardList @value
  time: ->
    @nextElementSibling.textContent = Time.format @value, new Date()
  backlink: ->
    @nextElementSibling.textContent = @value.replace /%id/, '123456789'
  fileInfo: ->
    data =
      isReply: true
      file:
        URL: '//i.4cdn.org/g/1334437723720.jpg'
        name: 'd9bb2efc98dd0df141a94399ff5880b7.jpg'
        size: '276 KB'
        sizeInBytes: 276 * 1024
        dimensions: '1280x720'
        isImage: true
        isSpoiler: true
    @nextElementSibling.innerHTML = FileInfo.h_format @value, data
  favicon: ->
    Favicon.switch()
    Unread.update() if g.VIEW is 'thread' and Conf['Unread Favicon']
    img = @nextElementSibling.children
    img[0].src = Favicon.default
    img[1].src = Favicon.unreadSFW
    img[2].src = Favicon.unreadNSFW
    img[3].src = Favicon.unreadDead
  sageEmoji: ->
    @nextElementSibling.firstElementChild.src = "data:image/png;base64,#{Emoji.sage[@value]}"
  togglecss: ->
    if $('textarea[name=usercss]', $.x 'ancestor::fieldset[1]', @).disabled = !@checked
      CustomCSS.rmStyle()
    else
      CustomCSS.addStyle()
    $.cb.checked.call @
  usercss: ->
    CustomCSS.update()

  keybinds: (section) ->
    section.innerHTML = <%= importHTML('Settings/Keybinds') %>
    $('.warning', section).hidden = Conf['Keybinds']

    tbody  = $ 'tbody', section
    items  = {}
    inputs = {}
    for key, arr of Config.hotkeys
      tr = $.el 'tr',
        innerHTML: '<td></td><td><input class=field></td>'
      tr.firstElementChild.textContent = arr[1]
      input = $ 'input', tr
      input.name = key
      input.spellcheck = false
      items[key]  = Conf[key]
      inputs[key] = input
      $.on input, 'keydown', Settings.keybind
      $.add tbody, tr
    $.get items, (items) ->
      for key, val of items
        inputs[key].value = val
      return
  keybind: (e) ->
    return if e.keyCode is 9 # tab
    e.preventDefault()
    e.stopPropagation()
    return unless (key = Keybinds.keyCode e)?
    @value = key
    $.cb.value.call @
