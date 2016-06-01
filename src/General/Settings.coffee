Settings =
  init: ->
    # 4chan X settings link
    link = $.el 'a',
      className:   'settings-link fa fa-wrench'
      textContent: 'Settings'
      title: '<%= meta.name %> Settings'
      href:        'javascript:;'
    $.on link, 'click', Settings.open

    Header.addShortcut link, 820

    add = @addSection

    add 'Main',     @main
    add 'Filter',   @filter
    add 'Sauce',    @sauce
    add 'Advanced', @advanced
    add 'Keybinds', @keybinds

    $.on d, 'AddSettingsSection',   Settings.addSection
    $.on d, 'OpenSettings', (e) -> Settings.open e.detail

    if Conf['Disable Native Extension']
      if $.hasStorage
        settings = JSON.parse(localStorage.getItem '4chan-settings') or {}
        return if settings.disableAll
        settings.disableAll = true
        localStorage.setItem '4chan-settings', JSON.stringify settings
      else
        $.onExists doc, 'body', ->
          $.global -> window.Config.disableAll = true

  open: (openSection) ->
    return if Settings.overlay
    $.event 'CloseMenu'

    Settings.dialog = dialog = $.el 'div',
      id:        'fourchanx-settings'
      className: 'dialog'
    $.extend dialog, <%= readHTML('Settings.html') %>

    Settings.overlay = overlay = $.el 'div',
      id: 'overlay'

    $.on $('.export', dialog), 'click',  Settings.export
    $.on $('.import', dialog), 'click',  Settings.import
    $.on $('.reset',  dialog), 'click',  Settings.reset
    $.on $('input',   dialog), 'change', Settings.onImport

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
    (if sectionToOpen then sectionToOpen else links[0]).click() unless openSection is 'none'

    $.on $('.close', dialog), 'click', Settings.close
    $.on overlay, 'click', Settings.close
    $.on window, 'beforeunload', Settings.close

    $.add d.body, [overlay, dialog]

    $.event 'OpenSettings', null, dialog

  close: ->
    return unless Settings.dialog
    # Unfocus current field to trigger change event.
    d.activeElement?.blur()
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

  warnings:
    localStorage: (cb) ->
      if $.cantSync
        why = if $.cantSet then 'save your settings' else 'synchronize settings between tabs'
        cb $.el 'li',
          textContent: """
            <%= meta.name %> needs local storage to #{why}.
            Enable it on boards.4chan.org in your browser's privacy settings (may be listed as part of "local data" or "cookies").
          """
    ads: (cb) ->
      $.onExists doc, '.ad-cnt', (ad) -> $.onExists ad, 'img', ->
        url = Redirect.to 'thread', {boardID: 'qa', threadID: 362590}
        cb $.el 'li',
          <%= html(
            'To protect yourself from <a href="${url}" target="_blank">malicious ads</a>,' +
            ' you should <a href="https://github.com/gorhill/uBlock#ublock-origin" target="_blank">block ads</a> on 4chan.'
          ) %>

  main: (section) ->
    warnings = $.el 'fieldset',
      hidden: true
    ,
      <%= html('<legend>Warnings</legend><ul></ul>') %>
    addWarning = (item) ->
      $.add $('ul', warnings), item
      warnings.hidden = false
    for key, warning of Settings.warnings
      warning addWarning
    $.add section, warnings

    items  = {}
    inputs = {}
    for key, obj of Config.main
      fs = $.el 'fieldset',
        <%= html('<legend>${key}</legend>') %>
      containers = [fs]
      for key, arr of obj
        description = arr[1]
        div = $.el 'div',
          <%= html('<label><input type="checkbox" name="${key}">${key}</label><span class="description">: ${description}</span>') %>
        div.hidden = true if $.engine isnt 'gecko' and key is 'Remember QR Size' # XXX not supported
        input = $ 'input', div
        $.on input, 'change', ->
          @parentNode.parentNode.dataset.checked = @checked
          $.cb.checked.call @
        items[key]  = Conf[key]
        inputs[key] = input
        level = arr[2] or 0
        if containers.length <= level
          container = $.el 'div', className: 'suboption-list'
          $.add containers[containers.length-1].lastElementChild, container
          containers[level] = container
        else if containers.length > level+1
          containers.splice level+1, containers.length - (level+1)
        $.add containers[level], div
      $.add section, fs

    $.get items, (items) ->
      for key, val of items
        inputs[key].checked = val
        inputs[key].parentNode.parentNode.dataset.checked = val
      return

    div = $.el 'div',
      <%= html('<button></button><span class="description">: Clear manually-hidden threads and posts on all boards. Reload the page to apply.') %>
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
        if $.hasStorage
          for boardID of hiddenThreads.boards
            localStorage.removeItem "4chan-hide-t-#{boardID}"
        $.delete ['hiddenThreads', 'hiddenPosts']
    $.after $('input[name="Stubs"]', section).parentNode.parentNode, div

  export: ->
    # Make sure to export the most recent data.
    $.get Conf, (Conf) ->
      Settings.downloadExport {version: g.VERSION, date: Date.now(), Conf}

  downloadExport: (data) ->
    a = $.el 'a',
      download: "<%= meta.name %> v#{g.VERSION}-#{data.date}.json"
      href: "data:application/json;base64,#{btoa unescape encodeURIComponent JSON.stringify data, null, 2}"
    p = $ '.imp-exp-result', Settings.dialog
    $.rmAll p
    $.add p, a
    a.click()

  import: ->
    $('input[type=file]', @parentNode).click()

  onImport: ->
    return unless file = @files[0]
    @value = null
    output = $('.imp-exp-result')
    unless confirm 'Your current settings will be entirely overwritten, are you sure?'
      output.textContent = 'Import aborted.'
      return

    reader = new FileReader()
    reader.onload = (e) ->
      try
        Settings.loadSettings JSON.parse(e.target.result), (err) ->
          if err
            output.textContent = 'Import failed due to an error.'
          else if confirm 'Import successful. Reload now?'
            window.location.reload()
      catch err
        output.textContent = 'Import failed due to an error.'
        c.error err.stack
    reader.readAsText file

  convertFrom:
    loadletter: (data) ->
      convertSettings = (data, map) ->
        for prevKey, newKey of map
          data.Conf[newKey] = data.Conf[prevKey] if newKey
          delete data.Conf[prevKey]
        data
      data = convertSettings data,
        # General confs
        'Disable 4chan\'s extension': 'Disable Native Extension'
        'Comment Auto-Expansion': ''
        'Remove Slug': ''
        'Check for Updates': ''
        'Recursive Filtering': 'Recursive Hiding'
        'Reply Hiding': 'Reply Hiding Buttons'
        'Thread Hiding': 'Thread Hiding Buttons'
        'Show Stubs': 'Stubs'
        'Image Auto-Gif': 'Replace GIF'
        'Reveal Spoilers': 'Reveal Spoiler Thumbnails'
        'Expand From Current': 'Expand from here'
        'Post in Title': 'Thread Excerpt'
        'Current Page': 'Page Count in Stats'
        'Current Page Position': ''
        'Alternative captcha': 'Use Recaptcha v1'
        'Auto Submit': 'Post on Captcha Completion'
        'Open Reply in New Tab': 'Open Post in New Tab'
        'Remember QR size': 'Remember QR Size'
        'Remember Subject': ''
        'Quote Inline': 'Quote Inlining'
        'Quote Preview': 'Quote Previewing'
        'Indicate OP quote': 'Mark OP Quotes'
        'Indicate You quote': 'Mark Quotes of You'
        'Indicate Cross-thread Quotes': 'Mark Cross-thread Quotes'
        # filter
        'uniqueid': 'uniqueID'
        'mod': 'capcode'
        'email': ''
        'country': 'flag'
        'md5': 'MD5'
        # keybinds
        'openEmptyQR': 'Open empty QR'
        'openQR': 'Open QR'
        'openOptions': 'Open settings'
        'close': 'Close'
        'spoiler': 'Spoiler tags'
        'sageru': 'Toggle sage'
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
      if data.WatchedThreads
        data.Conf['watchedThreads'] = boards: {}
        for boardID, threads of data.WatchedThreads
          for threadID, threadData of threads
            (data.Conf['watchedThreads'].boards[boardID] or= {})[threadID] = excerpt: threadData.textContent
      data

  upgrade: (data, version) ->
    changes = {}
    set = (key, value) ->
      data[key] = changes[key] = value
    addSauces = (sauces) ->
      if data['sauces']?
        sauces = sauces.filter (s) -> data['sauces'].indexOf(s.match(/[^#;\s]+|$/)[0]) < 0
        if sauces.length
          set 'sauces', data['sauces'] + '\n\n' + sauces.join('\n')
    compareString = version.replace(/\d+/g, (x) -> ('0000'+x)[-5..])
    if compareString < '00001.00011.00008.00000'
      unless data['Fixed Thread Watcher']?
        set 'Fixed Thread Watcher', data['Toggleable Thread Watcher'] ? true
      unless data['Exempt Archives from Encryption']?
        set 'Exempt Archives from Encryption', data['Except Archives from Encryption'] ? false
    if compareString < '00001.00011.00010.00001'
      if data['selectedArchives']?
        uids = {"Moe":0,"4plebs Archive":3,"Nyafuu Archive":4,"Love is Over":5,"Rebecca Black Tech":8,"warosu":10,"fgts":15,"not4plebs":22,"DesuStorage":23,"fireden.net":24,"disabled":null}
        for boardID, record of data['selectedArchives']
          for type, name of record when name of uids
            record[type] = uids[name]
        set 'selectedArchives', data['selectedArchives']
    if compareString < '00001.00011.00016.00000'
      if (rice = Config['usercss'].match(/\/\* Board title rice \*\/(?:\n.+)*/)[0])
        if data['usercss']? and data['usercss'].indexOf(rice) < 0
          set 'usercss', rice + '\n\n' + data['usercss']
    if compareString < '00001.00011.00017.00000'
      for key in ['Persistent QR', 'Color User IDs', 'Fappe Tyme', 'Werk Tyme', 'Highlight Posts Quoting You', 'Highlight Own Posts']
        set key, (key is 'Persistent QR') unless data[key]?
    if compareString < '00001.00011.00017.00006'
      if data['sauces']?
        set 'sauces', data['sauces'].replace(/^(#?\s*)http:\/\/iqdb\.org\//mg, '$1//iqdb.org/')
    if compareString < '00001.00011.00019.00003' and not Settings.overlay
      $.queueTask -> Settings.warnings.ads (item) -> new Notice 'warning', [item.childNodes...]
    if compareString < '00001.00011.00020.00003'
      for key, value of {'Inline Cross-thread Quotes Only': false, 'Pass Link': true}
        set key, value unless data[key]?
    if compareString < '00001.00011.00021.00003'
      unless data['Remember Your Posts']?
        set 'Remember Your Posts', data['Mark Quotes of You'] ? true
    if compareString < '00001.00011.00022.00000'
      if data['sauces']?
        set 'sauces', data['sauces'].replace(/^(#?\s*https:\/\/www\.google\.com\/searchbyimage\?image_url=%(?:IMG|URL))%3Fs\.jpg/mg, '$1')
        set 'sauces', data['sauces'].replace(/^#?\s*https:\/\/www\.google\.com\/searchbyimage\?image_url=%(?:IMG|T?URL)(?=$|;)/mg, '$&&safe=off')
    if compareString < '00001.00011.00022.00002'
      if not data['Use Recaptcha v1 in Reports']? and data['Use Recaptcha v1'] and not data['Use Recaptcha v2 in Reports']
        set 'Use Recaptcha v1 in Reports', true
    if compareString < '00001.00011.00024.00000'
      if data['JSON Navigation']? and not data['JSON Index']?
        set 'JSON Index', data['JSON Navigation']
    if compareString < '00001.00011.00026.00000'
      if data['Oekaki Links']? and not data['Edit Link']?
        set 'Edit Link', data['Oekaki Links']
      set 'Inline Cross-thread Quotes Only', true unless data['Inline Cross-thread Quotes Only']?
    if compareString < '00001.00011.00030.00000'
      if data['Quote Threading'] and not data['Thread Quotes']?
        set 'Thread Quotes', true
    if compareString < '00001.00011.00032.00000'
      if data['sauces']?
        set 'sauces', data['sauces'].replace(/^(#?\s*)http:\/\/3d\.iqdb\.org\//mg, '$1//3d.iqdb.org/')
      addSauces [
        '#https://desustorage.org/_/search/image/%sMD5/'
        '#https://boards.fireden.net/_/search/image/%sMD5/'
        '#https://foolz.fireden.net/_/search/image/%sMD5/'
        '#//www.gif-explode.com/%URL;types:gif'
        '#//whatanime.ga/?auto&url=%IMG'
      ]
    changes

  loadSettings: (data, cb) ->
    if data.version.split('.')[0] is '2' # https://github.com/loadletter/4chan-x
      data = Settings.convertFrom.loadletter data
    else if data.version isnt g.VERSION
      Settings.upgrade data.Conf, data.version
    $.clear (err) ->
      return cb err if err
      $.set data.Conf, cb

  reset: ->
    if confirm 'Your current settings will be entirely wiped, are you sure?'
      $.clear (err) ->
        if err
          $('.imp-exp-result').textContent = 'Import failed due to an error.'
        else if confirm 'Reset successful. Reload now?'
          window.location.reload()

  filter: (section) ->
    $.extend section, <%= readHTML('Filter-select.html') %>
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
    $.extend div, <%= readHTML('Filter-guide.html') %>
    $('.warning', div).hidden = Conf['Filter']

  sauce: (section) ->
    $.extend section, <%= readHTML('Sauce.html') %>
    $('.warning', section).hidden = Conf['Sauce']
    ta = $ 'textarea', section
    $.get 'sauces', Conf['sauces'], (item) ->
      ta.value = item['sauces']
    $.on ta, 'change', $.cb.value

  advanced: (section) ->
    $.extend section, <%= readHTML('Advanced.html') %>
    warning.hidden = Conf[warning.dataset.feature] for warning in $$ '.warning', section

    inputs = {}
    for input in $$ '[name]', section
      inputs[input.name] = input

    $.on inputs['archiveLists'], 'change', ->
      $.set 'lastarchivecheck', 0
      Conf['lastarchivecheck'] = 0
      $.id('lastarchivecheck').textContent = 'never'

    items = {}
    for name in ['archiveLists', 'archiveAutoUpdate', 'captchaLanguage', 'boardnav', 'time', 'backlink', 'fileInfo', 'QR.personas', 'favicon', 'usercss', 'customCooldown']
      items[name] = Conf[name]
      input = inputs[name]
      event = if name in ['archiveLists', 'archiveAutoUpdate', 'QR.personas', 'favicon', 'usercss'] then 'change' else 'input'
      $.on input, event, $.cb[if input.type is 'checkbox' then 'checked' else 'value']
      $.on input, event, Settings[name] if name of Settings

    $.get items, (items) ->
      for key, val of items
        input = inputs[key]
        input[if input.type is 'checkbox' then 'checked' else 'value'] = val
        if key of Settings
          Settings[key].call input
      return

    interval  = inputs['Interval']
    customCSS = inputs['Custom CSS']
    applyCSS  = $ '#apply-css', section

    interval.value             =  Conf['Interval']
    customCSS.checked          =  Conf['Custom CSS']
    inputs['usercss'].disabled = !Conf['Custom CSS']
    applyCSS.disabled          = !Conf['Custom CSS']

    $.on interval,  'change', ThreadUpdater.cb.interval
    $.on customCSS, 'change', Settings.togglecss
    $.on applyCSS,  'click',  -> CustomCSS.update()

    itemsArchive = {}
    itemsArchive[name] = Conf[name] for name in ['archives', 'selectedArchives', 'lastarchivecheck']
    $.get itemsArchive, (itemsArchive) ->
      $.extend Conf, itemsArchive
      Redirect.selectArchives()
      Settings.addArchiveTable section

    boardSelect    = $ '#archive-board-select', section
    table          = $ '#archive-table', section
    updateArchives = $ '#update-archives', section

    $.on boardSelect, 'change', ->
      $('tbody > :not([hidden])', table).hidden = true
      $("tbody > .#{@value}", table).hidden = false

    $.on updateArchives, 'click', ->
      Redirect.update ->
        Settings.addArchiveTable section

  addArchiveTable: (section) ->
    $('#lastarchivecheck', section).textContent = if Conf['lastarchivecheck'] is 0
      'never'
    else
      new Date(Conf['lastarchivecheck']).toLocaleString()

    boardSelect = $ '#archive-board-select', section
    table       = $ '#archive-table', section
    tbody       = $ 'tbody', section

    $.rmAll boardSelect
    $.rmAll tbody

    archBoards = {}
    for {uid, name, boards, files, software, withCredentials} in Conf['archives']
      for boardID in boards
        o = archBoards[boardID] or=
          thread: [[], []]
          post:   [[], []]
          file:   [[], []]
        i = +!!withCredentials
        archive = [uid ? name, name]
        o.thread[i].push archive
        o.post[i].push   archive if software is 'foolfuuka'
        o.file[i].push   archive if boardID in files
    for boardID, o of archBoards
      for item in ['thread', 'post', 'file']
        i = if o[item][0].length then 1 else 0
        o[item][i].push [null, 'disabled']
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

    if rows.length is 0
      boardSelect.hidden = table.hidden = true
      return

    boardSelect.hidden = table.hidden = false

    unless g.BOARD.ID of archBoards
      rows[0].hidden = false

    $.add boardSelect, boardOptions
    $.add tbody, rows

    for boardID, data of Conf['selectedArchives']
      for type, id of data
        if (select = $ "select[data-boardid='#{boardID}'][data-type='#{type}']", tbody)
          select.value = JSON.stringify id
          select.value = select.firstChild.value unless select.value
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
        value: JSON.stringify archive[0]
        textContent: archive[1]

    $.extend td, <%= html('<select></select>') %>
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
      (selectedArchives[@dataset.boardid] or= {})[@dataset.type] = JSON.parse @value
      $.set 'selectedArchives', selectedArchives
      Conf['selectedArchives'] = selectedArchives
      Redirect.selectArchives()

  boardnav: ->
    Header.generateBoardList @value

  time: ->
    @nextElementSibling.textContent = Time.format @value, new Date()

  backlink: ->
    @nextElementSibling.textContent = @value.replace /%(?:id|%)/g, (x) -> {'%id': '123456789', '%%': '%'}[x]

  fileInfo: ->
    data =
      isReply: true
      file:
        url: '//i.4cdn.org/g/1334437723720.jpg'
        name: 'd9bb2efc98dd0df141a94399ff5880b7.jpg'
        size: '276 KB'
        sizeInBytes: 276 * 1024
        dimensions: '1280x720'
        isImage: true
        isVideo: false
        isSpoiler: true
        tag: 'Loop'
    FileInfo.format @value, data, @nextElementSibling

  favicon: ->
    Favicon.switch()
    Unread.update() if g.VIEW is 'thread' and Conf['Unread Favicon']
    img = @nextElementSibling.children
    img[0].src = Favicon.default
    img[1].src = Favicon.unreadSFW
    img[2].src = Favicon.unreadNSFW
    img[3].src = Favicon.unreadDead

  togglecss: ->
    if $('textarea[name=usercss]', $.x 'ancestor::fieldset[1]', @).disabled = $.id('apply-css').disabled = !@checked
      CustomCSS.rmStyle()
    else
      CustomCSS.addStyle()
    $.cb.checked.call @

  keybinds: (section) ->
    $.extend section, <%= readHTML('Keybinds.html') %>
    $('.warning', section).hidden = Conf['Keybinds']

    tbody  = $ 'tbody', section
    items  = {}
    inputs = {}
    for key, arr of Config.hotkeys
      tr = $.el 'tr',
        <%= html('<td>${arr[1]}</td><td><input class="field"></td>') %>
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

return Settings
