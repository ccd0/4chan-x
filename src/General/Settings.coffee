Settings =
  init: ->
    # 4chan X settings link
    link = $.el 'a',
      className:   'settings-link'
      textContent: '<%= meta.name %> Settings'
      href:        'javascript:;'
    $.on link, 'click', Settings.open
    $.event 'AddMenuEntry',
      type: 'header'
      el: link
      order: 111

    # 4chan settings link
    link = $.el 'a',
      className:   'fourchan-settings-link'
      textContent: '4chan Settings'
      href:        'javascript:;'
    $.on link, 'click', -> $.id('settingsWindowLink').click()
    $.event 'AddMenuEntry',
      type: 'header'
      el: link
      order: 110
      open: -> Conf['Enable 4chan\'s Extension']

    $.get 'previousversion', null, (item) ->
      if previous = item['previousversion']
        return if previous is g.VERSION
        changelog = '<%= meta.repo %>blob/<%= meta.mainBranch %>/CHANGELOG.md'
        el = $.el 'span',
          innerHTML: "<%= meta.name %> has been updated to <a href='#{changelog}' target=_blank>version #{g.VERSION}</a>."
        new Notification 'info', el, 30
      else
        $.on d, '4chanXInitFinished', Settings.open
      # The archive list will always be updated with 4chan X updates.
      Conf['archives'] = Redirect.archives
      now = Date.now()
      $.set
        archives: Conf['archives']
        lastarchivecheck: now
        lastupdate: now
        previousversion: g.VERSION

    Settings.addSection 'Main',     Settings.main
    Settings.addSection 'Filter',   Settings.filter
    Settings.addSection 'QR',       Settings.qr
    Settings.addSection 'Sauce',    Settings.sauce
    Settings.addSection 'Rice',     Settings.rice
    Settings.addSection 'Archives', Settings.archives
    Settings.addSection 'Keybinds', Settings.keybinds
    $.on d, 'AddSettingsSection',   Settings.addSection
    $.on d, 'OpenSettings',         (e) -> Settings.open e.detail

    return if Conf['Enable 4chan\'s Extension']
    settings = JSON.parse(localStorage.getItem '4chan-settings') or {}
    return if settings.disableAll
    settings.disableAll = true
    localStorage.setItem '4chan-settings', JSON.stringify settings

  open: (openSection) ->
    $.off d, '4chanXInitFinished', Settings.open
    return if Settings.dialog
    $.event 'CloseMenu'

    html = """
    <%= grunt.file.read('html/General/Settings.html').replace(/>\s+</g, '><').trim() %>
    """

    Settings.dialog = overlay = $.el 'div',
      id: 'overlay'
      innerHTML: html

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
    $.add $('.sections-list', overlay), links
    (if sectionToOpen then sectionToOpen else links[0]).click()

    $.on $('.close', overlay), 'click', Settings.close
    $.on overlay,              'click', Settings.close
    $.on overlay.firstElementChild, 'click', (e) -> e.stopPropagation()

    d.body.style.width = "#{d.body.clientWidth}px"
    $.addClass d.body, 'unscroll'
    $.add d.body, overlay
  close: ->
    return unless Settings.dialog
    d.body.style.removeProperty 'width'
    $.rmClass d.body, 'unscroll'
    $.rm Settings.dialog
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

  main: (section) ->
    section.innerHTML = """
    <%= grunt.file.read('html/General/Settings-section-Main.html').replace(/>\s+</g, '><').trim() %>
    """
    $.on $('.export', section), 'click',  Settings.export
    $.on $('.import', section), 'click',  Settings.import
    $.on $('input',   section), 'change', Settings.onImport

    items  = {}
    inputs = {}
    for key, obj of Config.main
      fs = $.el 'fieldset',
        innerHTML: "<legend>#{key}</legend>"
      for key, arr of obj
        description = arr[1]
        div = $.el 'div',
          innerHTML: "<label><input type=checkbox name=\"#{key}\">#{key}</label><span class=description>: #{description}</span>"
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
      innerHTML: "<button></button><span class=description>: Clear manually-hidden threads and posts on all boards. Refresh the page to apply."
    button = $ 'button', div
    hiddenNum = 0
    $.get 'hiddenThreads', boards: {}, (item) ->
      for ID, board of item.hiddenThreads.boards
        for ID, thread of board
          hiddenNum++
      button.textContent = "Hidden: #{hiddenNum}"
    $.get 'hiddenPosts', boards: {}, (item) ->
      for ID, board of item.hiddenPosts.boards
        for ID, thread of board
          for ID, post of thread
            hiddenNum++
      button.textContent = "Hidden: #{hiddenNum}"
    $.on button, 'click', ->
      @textContent = 'Hidden: 0'
      $.get 'hiddenThreads', boards: {}, (item) ->
        for boardID of item.hiddenThreads.boards
          localStorage.removeItem "4chan-hide-t-#{boardID}"
        $.delete ['hiddenThreads', 'hiddenPosts']
    $.after $('input[name="Stubs"]', section).parentNode.parentNode, div
  export: (now, data) ->
    unless typeof now is 'number'
      now  = Date.now()
      data =
        version: g.VERSION
        date: now
      Conf['WatchedThreads'] = {}
      for db in DataBoards
        Conf[db] = boards: {}
      # Make sure to export the most recent data.
      $.get Conf, (Conf) ->
        # XXX don't export archives.
        delete Conf['archives']
        data.Conf = Conf
        Settings.export now, data
      return
    a = $.el 'a',
      className: 'warning'
      textContent: 'Save me!'
      download: "<%= meta.name %> v#{g.VERSION}-#{now}.json"
      href: "data:application/json;base64,#{btoa unescape encodeURIComponent JSON.stringify data, null, 2}"
      target: '_blank'
    <% if (type === 'userscript') { %>
    # XXX Firefox won't let us download automatically.
    p = $ '.imp-exp-result', Settings.dialog
    $.rmAll p
    $.add p, a
    <% } else { %>
    a.click()
    <% } %>
  import: ->
    @nextElementSibling.click()
  onImport: ->
    return unless file = @files[0]
    output = @parentNode.nextElementSibling
    unless confirm 'Your current settings will be entirely overwritten, are you sure?'
      output.textContent = 'Import aborted.'
      return
    reader = new FileReader()
    reader.onload = (e) ->
      try
        data = JSON.parse e.target.result
        Settings.loadSettings data
        if confirm 'Import successful. Refresh now?'
          window.location.reload()
      catch err
        output.textContent = 'Import failed due to an error.'
        c.error err.stack
    reader.readAsText file
  loadSettings: (data) ->
    version = data.version.split '.'
    if version[0] is '2'
      data = Settings.convertSettings data,
        # General confs
        'Disable 4chan\'s extension': ''
        'Catalog Links': ''
        'Reply Navigation': ''
        'Show Stubs': 'Stubs'
        'Image Auto-Gif': 'Auto-GIF'
        'Expand From Current': ''
        'Unread Favicon': 'Unread Tab Icon'
        'Post in Title': 'Thread Excerpt'
        'Auto Hide QR': ''
        'Open Reply in New Tab': ''
        'Remember QR size': ''
        'Quote Inline': 'Quote Inlining'
        'Quote Preview': 'Quote Previewing'
        'Indicate OP quote': 'Mark OP Quotes'
        'Indicate Cross-thread Quotes': 'Mark Cross-thread Quotes'
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
      for key, val of Config.hotkeys
        continue unless key of data.Conf
        data.Conf[key] = data.Conf[key].replace(/ctrl|alt|meta/g, (s) -> "#{s[0].toUpperCase()}#{s[1..]}").replace /(^|.+\+)[A-Z]$/g, (s) ->
          "Shift+#{s[0...-1]}#{s[-1..].toLowerCase()}"
      data.Conf.WatchedThreads = data.WatchedThreads
    $.set data.Conf
  convertSettings: (data, map) ->
    for prevKey, newKey of map
      data.Conf[newKey] = data.Conf[prevKey] if newKey
      delete data.Conf[prevKey]
    data

  filter: (section) ->
    section.innerHTML = """
    <%= grunt.file.read('html/General/Settings-section-Filter.html').replace(/>\s+</g, '><').trim() %>
    """
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
    div.innerHTML = """
    <%= grunt.file.read('html/General/Settings-section-Filter-guide.html').replace(/>\s+</g, '><').trim() %>
    """

  qr: (section) ->
    section.innerHTML = """
    <%= grunt.file.read('html/General/Settings-section-QR.html').replace(/>\s+</g, '><').trim() %>
    """
    ta = $ 'textarea', section
    $.get 'QR.personas', Conf['QR.personas'], (item) ->
      ta.value = item['QR.personas']
    $.on ta, 'change', $.cb.value

  sauce: (section) ->
    section.innerHTML = """
    <%= grunt.file.read('html/General/Settings-section-Sauce.html').replace(/>\s+</g, '><').trim() %>
    """
    ta = $ 'textarea', section
    $.get 'sauces', Conf['sauces'], (item) ->
      ta.value = item['sauces']
    $.on ta, 'change', $.cb.value

  rice: (section) ->
    section.innerHTML = """
    <%= grunt.file.read('html/General/Settings-section-Rice.html').replace(/>\s+</g, '><').trim() %>
    """
    items = {}
    inputs = {}
    for name in ['boardnav', 'time', 'backlink', 'fileInfo', 'favicon', 'usercss']
      input = $ "[name=#{name}]", section
      items[name]  = Conf[name]
      inputs[name] = input
      $.on input, 'change', $.cb.value
    $.get items, (items) ->
      for key, val of items
        input = inputs[key]
        input.value = val
        continue if key is 'usercss'
        event = if key in ['favicon', 'usercss']
          'change'
        else
          'input'
        $.on input, event, Settings[key]
        Settings[key].call input
      return
    $.on $('input[name="Custom CSS"]', section), 'change', Settings.togglecss
    $.on $('#apply-css', section), 'click', Settings.usercss
  boardnav: ->
    Header.generateBoardList @value
  time: ->
    funk = Time.createFunc @value
    @nextElementSibling.textContent = funk Time, new Date()
  backlink: ->
    @nextElementSibling.textContent = @value.replace /%id/, '123456789'
  fileInfo: ->
    data =
      isReply: true
      file:
        URL: '//images.4chan.org/g/src/1334437723720.jpg'
        name: 'd9bb2efc98dd0df141a94399ff5880b7.jpg'
        size: '276 KB'
        sizeInBytes: 276 * 1024
        dimensions: '1280x720'
        isImage: true
        isSpoiler: true
    funk = FileInfo.createFunc @value
    @nextElementSibling.innerHTML = funk FileInfo, data
  favicon: ->
    Favicon.switch()
    Unread.update() if g.VIEW is 'thread' and Conf['Unread Tab Icon']
    @nextElementSibling.innerHTML = """
      <img src=#{Favicon.default}>
      <img src=#{Favicon.unreadSFW}>
      <img src=#{Favicon.unreadNSFW}>
      <img src=#{Favicon.unreadDead}>
      """
  togglecss: ->
    if $('textarea[name=usercss]', $.x 'ancestor::fieldset[1]', @).disabled = !@checked
      CustomCSS.rmStyle()
    else
      CustomCSS.addStyle()
    $.cb.checked.call @
  usercss: ->
    CustomCSS.update()

  archives: (section) ->
    section.innerHTML = """
    <%= grunt.file.read('html/General/Settings-section-Archives.html').replace(/>\s+</g, '><').trim() %>
    """

    showLastUpdateTime = (time) ->
      $('time', section).textContent = new Date(time).toLocaleString()

    button = $ 'button', section
    $.on button, 'click', ->
      $.delete 'lastarchivecheck'
      button.textContent = '...'
      button.disabled = true
      Redirect.update (time) ->
        button.textContent = 'Updated'
        showLastUpdateTime time

    $.get 'lastarchivecheck', 0, ({lastarchivecheck}) -> showLastUpdateTime lastarchivecheck

    boards = {}
    for archive in Conf['archives']
      for boardID in archive.boards
        data = boards[boardID] or= {
          thread: []
          post:   []
          file:   []
        }
        data.thread.push archive
        if archive.software is 'foolfuuka'
          data.post.push archive
        if boardID in archive.files
          data.file.push archive

    rows = []
    for boardID in Object.keys(boards).sort() # Alphabetical order
      row = $.el 'tr'
      rows.push row
      $.add row, $.el 'th',
        textContent: "/#{boardID}/"
        className: if boardID is g.BOARD.ID then 'warning' else ''

      data = boards[boardID]
      Settings.addArchiveCell row, boardID, data, 'thread'
      Settings.addArchiveCell row, boardID, data, 'post'
      Settings.addArchiveCell row, boardID, data, 'file'
    $.add $('tbody', section), rows
    $.get 'selectedArchives', Conf['selectedArchives'], ({selectedArchives}) ->
      for boardID, data of selectedArchives
        for type, uid of data
          if option = $ "select[data-boardid='#{boardID}'][data-type='#{type}'] > option[value='#{uid}']", section
            option.selected = true
      return
  addArchiveCell: (row, boardID, data, type) ->
    options = []
    for archive in data[type]
      options.push $.el 'option',
        textContent: archive.name
        value: archive.uid
    td = $.el 'td'
    {length} = options
    if length
      td.innerHTML = '<select></select>'
      select = td.firstElementChild
      unless select.disabled = length is 1
        $.extend select.dataset,
          boardid: boardID
          type: type
        $.on select, 'change', Settings.saveSelectedArchive
      $.add select, options
    else
      td.textContent = 'N/A'
    $.add row, td
  saveSelectedArchive: ->
    $.get 'selectedArchives', Conf['selectedArchives'], ({selectedArchives}) =>
      (selectedArchives[@dataset.boardid] or= {})[@dataset.type] = +@value
      $.set 'selectedArchives', selectedArchives

  keybinds: (section) ->
    section.innerHTML = """
    <%= grunt.file.read('html/General/Settings-section-Keybinds.html').replace(/>\s+</g, '><').trim() %>
    """
    tbody  = $ 'tbody', section
    items  = {}
    inputs = {}
    for key, arr of Config.hotkeys
      tr = $.el 'tr',
        innerHTML: "<td>#{arr[1]}</td><td><input class=field></td>"
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
