Settings =
  init: ->
    # Appchan X settings link
    el = $.el 'a',
      className:   'settings-link'
      title:       'Appchan X Settings'
      href:        'javascript:;'
      textContent: 'Settings'
    $.on el, 'click', @open

    Header.menu.addEntry
      el: el
      order: 1

    add = @addSection

    add 'Style',    @style
    add 'Themes',   @themes
    add 'Mascots',  @mascots
    add 'Main',     @main
    add 'Filter',   @filter
    add 'Sauce',    @sauce
    add 'Advanced', @advanced
    add 'Keybinds', @keybinds

    $.on d, 'AddSettingsSection',   Settings.addSection
    $.on d, 'OpenSettings', (e) -> Settings.open e.detail

    settings = JSON.parse(localStorage.getItem '4chan-settings') or {}
    unless settings.disableAll
      settings.disableAll = true
      check = true
    if settings.keyBinds
      # Keybinds persist even with disableAll. Thanks moot.
      settings.keyBinds = false
      check = true
    localStorage.setItem '4chan-settings', JSON.stringify settings if check

  open: (openSection) ->
    if Conf['editMode'] is "theme"
      if confirm "Opening the options dialog will close and discard any theme changes made with the theme editor."
        ThemeTools.close()
      return

    if Conf['editMode'] is "mascot"
      if confirm "Opening the options dialog will close and discard any mascot changes made with the mascot editor."
        MascotTools.close()
      return

    return if Settings.overlay
    $.event 'CloseMenu'

    Settings.dialog = dialog = $.el 'div',
      id:    'appchanx-settings'
      class: 'dialog'
    $.extend dialog, <%= importHTML('Settings/Settings') %>

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
      links.push link
      sectionToOpen = link if section.title is openSection
    $.add $('.sections-list', dialog), links
    (if sectionToOpen then sectionToOpen else links[0]).click() unless openSection is 'none'

    $.on $('.close', dialog), 'click', Settings.close
    $.on overlay,             'click', Settings.close

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

  openSection: (mode) ->
    if selected = $ '.tab-selected', Settings.dialog
      $.rmClass selected, 'tab-selected'
    $.addClass $(".tab-#{@hyphenatedTitle}", Settings.dialog), 'tab-selected'
    section = $ 'section', Settings.dialog
    $.rmAll section
    section.className = "section-#{@hyphenatedTitle}"
    @open section, mode
    section.scrollTop = 0
    $.event 'OpenSettings', null, section

  main: (section) ->
    items  = {}
    inputs = {}
    for key, obj of Config.main
      fs = $.el 'fieldset',
        <%= html('<legend>${key}</legend>') %>
      containers = [fs]
      for key, arr of obj
        description = arr[1]
        div = $.el 'div'
        $.add div, [
          UI.checkbox key, key, false
          $.el 'span', className: 'description', textContent: ": #{description}"
        ]
        input = $ 'input', div
        $.on $('label', div), 'mouseover', Settings.mouseover
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
      Rice.nodes fs
      $.add section, fs

    $.get items, (items) ->
      for key, val of items
        inputs[key].checked = val
        inputs[key].parentNode.parentNode.dataset.checked = val
      return

    div = $.el 'div',
      <%= html('<button></button><span class="description">: Clear manually-hidden threads and posts on all boards. Reload the page to apply.') %>
    button = $ 'button', div
    $.get 'hiddenPosts', {}, ({hiddenPosts}) ->
      hiddenNum = 0
      for ID, board of hiddenPosts.boards
        for ID, thread of board
          hiddenNum += Object.keys(thread).length
      button.textContent = "Hidden: #{hiddenNum}"
    $.on button, 'click', ->
      @textContent = 'Hidden: 0'
      $.delete 'hiddenPosts'
    $.after $('input[name="Recursive Hiding"]', section).parentNode.parentNode, div

  export: ->
    # Make sure to export the most recent data.
    $.get Conf, (Conf) ->
      # XXX don't export archives.
      delete Conf['archives']
      Settings.downloadExport 'Settings', {version: g.VERSION, date: Date.now(), Conf}

  downloadExport: (title, data) ->
    a = $.el 'a',
      download: "<%= meta.name %> v#{g.VERSION} #{title}.#{data.date}.json"
      href: "data:application/json;base64,#{btoa unescape encodeURIComponent JSON.stringify data, null, 2}"
    <% if (type === 'userscript') { %>$.add d.body, a<% } %>
    a.click()
    <% if (type === 'userscript') { %>$.rm a<% } %>
  import: ->
    $('input[type=file]', @parentNode).click()

  onImport: ->
    return unless file = @files[0]
    unless confirm 'Your current settings will be entirely overwritten, are you sure?'
      new Notice 'info', "Import aborted.", 1
      return

    reader = new FileReader()
    reader.onload = (e) ->
      try
        Settings.loadSettings JSON.parse e.target.result
        if confirm 'Import successful. Reload now?'
          window.location.reload()
      catch err
        alert 'Import failed due to an error.'
        c.error err.stack
    reader.readAsText file

  loadSettings: (data) ->
    if data.Conf['WatchedThreads']
      data.Conf['watchedThreads'] = boards: ThreadWatcher.convert data.Conf['WatchedThreads']
      delete data.Conf['WatchedThreads']
    $.clear -> $.set data.Conf

  reset: ->
    if confirm 'Your current settings will be entirely wiped, are you sure?'
      $.clear -> window.location.reload() if confirm 'Reset successful. Reload now?'

  filter: (section) ->
    $.extend section, <%= importHTML('Settings/Filter-select') %>
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
    $.extend div, <%= importHTML('Settings/Filter-guide') %>
    $('.warning', div).hidden = Conf['Filter']

  sauce: (section) ->
    $.extend section, <%= importHTML('Settings/Sauce') %>
    ta = $ 'textarea', section
    $.get 'sauces', Conf['sauces'], (item) ->
      ta.value = item['sauces']
    $.on ta, 'change', $.cb.value

  advanced: (section) ->
    $.extend section, <%= importHTML('Settings/Advanced') %>
    warning.hidden = Conf[warning.dataset.feature] for warning in $$ '.warning', section

    items = {}
    inputs = {}
    for name in ['boardnav', 'time', 'backlink', 'fileInfo', 'favicon', 'usercss']
      input = $ "[name='#{name}']", section
      items[name]  = Conf[name]
      inputs[name] = input
      event = if name in ['favicon', 'usercss']
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
        input = inputs[key]
        input.value = val
        continue if key is 'usercss'
        $.on input, event, Settings[key]
        Settings[key].call input
      Rice.nodes section

    interval  = $ 'input[name="Interval"]',   section
    customCSS = $ 'input[name="Custom CSS"]', section

    interval.value             =  Conf['Interval']
    customCSS.checked          =  Conf['Custom CSS']
    inputs['usercss'].disabled = !Conf['Custom CSS']

    $.on interval,                 'change', ThreadUpdater.cb.interval
    $.on customCSS,                'change', Settings.togglecss
    $.on $('#apply-css', section), 'click',  Settings.usercss

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

    rows[0].hidden = not g.BOARD.ID of archBoards

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
      (selectedArchives[@dataset.boardid] or= {})[@dataset.type] = @value
      $.set 'selectedArchives', selectedArchives

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
        URL: '//i.4cdn.org/g/1334437723720.jpg'
        name: 'd9bb2efc98dd0df141a94399ff5880b7.jpg'
        size: '276 KB'
        sizeInBytes: 276 * 1024
        dimensions: '1280x720'
        isImage: true
        isSpoiler: true
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
    if $('textarea[name=usercss]', $.x 'ancestor::fieldset[1]', @).disabled = !@checked
      CustomCSS.rmStyle()
    else
      CustomCSS.addStyle()
    $.cb.checked.call @

  usercss: ->
    CustomCSS.update()

  keybinds: (section) ->
    $.extend section, <%= importHTML('Settings/Keybinds') %>
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
      Rice.nodes tr
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

  style: (section) ->
    nodes  = $.frag()
    items  = {}
    inputs = {}

    for key, obj of Config.style

      fs = $.el 'fieldset',
        innerHTML: "<legend>#{key}</legend>"

      for key, arr of obj
        [value, description, type] = arr

        div = $.el 'div',
          className: 'styleoption'

        if type

          if type is 'text'

            $.extend div, <%= html('<div class="option"><span class="optionlabel">${key}</span></div><div class="description">${description}</div><div class="option"><input name="${key}" style="width: 100%"></div>') %>
            input = $ "input", div

          else

            html = "<div class=option><span class=optionlabel>#{key}</span></div><div class=description>#{description}</div><div class=option><select name='#{key}'>"
            for name in type
              html += "<option value='#{name}'>#{name}</option>"
            html += "</select></div>"
            div.innerHTML = html
            input = $ "select", div

        else
          span = $.el 'span',
            class: 'description'
            textContent: description

          span.style.display = 'none'

          $.add div, [
            box = UI.checkbox key, key
            span
          ]

          box.className = 'option'

          input = $ 'input', div

        items[key]  = Conf[key]
        inputs[key] = input

        $.on $('.option', div), 'mouseover', Settings.mouseover

        $.add fs, div
      $.add nodes, fs

    $.get items, (items) ->
      cb = Settings.cb.style
      for key, val of items
        input = inputs[key]
        if input.type is 'checkbox'
          input.checked = val
          $.on input, 'change', cb.checked
        else if input.nodeName is 'SELECT'
          input.value = val
          $.on input, 'change', cb.select
        else
          input.value = val
          $.on input, 'change', cb.value

      Rice.nodes nodes
      $.add section, nodes

  themes: (section, mode) ->
    if typeof mode isnt 'string'
      mode = 'default'

    parentdiv  = $.el 'div',
      id:        "themeContainer"

    suboptions = $.el 'div',
      className: "suboptions"
      id:        "themes"

    keys = Object.keys(Themes)
    keys.sort()

    cb = Settings.cb.theme
    mouseover = -> @style.color = "#{@dataset.hover}"
    mouseout  = -> @style.color = "#{@dataset.color}"

    if mode is "default"

      for name in keys
        theme = Themes[name]

        continue if theme["Deleted"]

        div = $.el 'div',
          className: "theme #{if name is Conf[g.THEMESTRING] then 'selectedtheme' else ''}"
          id:        name

        $.extend div, <%= importHTML('Settings/Theme') %>

        div.style.backgroundColor = theme['Background Color']

        for a in $$ 'a[data-color]', div
          a.style.color = "#{a.dataset.color}"
          $.on a, 'mouseover', mouseover
          $.on a, 'mouseout',  mouseout

        $.on $('a.edit',   div), 'click', cb.edit
        $.on $('a.export', div), 'click', cb.export
        $.on $('a.delete', div), 'click', cb.delete

        $.on div, 'click', cb.select

        $.add suboptions, div

      div = $.el 'div',
        id:        'addthemes'

      $.extend div, <%= importHTML('Settings/Batch-Theme') %>

      $.on $("#newtheme", div), 'click', ->
        ThemeTools.init "untitled"
        Settings.close()

      $.on $("#import", div), 'click', ->
        @nextSibling.click()

      $.on $("#importbutton", div), 'change', ThemeTools.importtheme

      $.on $('#tUndelete', div), 'click', ->
        $.rm $.id "themeContainer"

        themes =
          open:            Settings.themes
          hyphenatedTitle: 'themes'

        Settings.openSection.apply themes, ['undelete']

    else

      for name in keys
        theme = Themes[name]

        continue unless theme["Deleted"]

        div = $.el 'div',
          id:        name
          className: theme

        $.extend div, <%= importHTML('Settings/Deleted-Theme') %>

        $.on div, 'click', cb.restore

        $.add suboptions, div

      div = $.el 'div',
        id:        'addthemes'
        innerHTML: "<a href='javascript:;'>Return</a>"

      $.on $('a', div), 'click', ->
        themes =
          open:            Settings.themes
          hyphenatedTitle: 'themes'

        $.rm $.id "themeContainer"
        Settings.openSection.call themes

    $.add parentdiv, suboptions
    $.add parentdiv, div
    $.add section, parentdiv

  mouseover: (e) ->
    mouseover = $.el 'div',
      id:        'mouseover'
      className: 'dialog'

    $.add Header.hover, mouseover

    mouseover.innerHTML = @nextElementSibling.innerHTML

    UI.hover
      root:        @
      el:          mouseover
      latestEvent: e
      endEvents:   'mouseout'
      asapTest: -> true
      offsetX: 15
      offsetY: -5

    return

  mascots: (section, mode) ->
    categories = {}
    cb         = Settings.cb.mascot

    if typeof mode isnt 'string'
      mode = 'default'

    suboptions = $.el "div",
      className: "suboptions"

    mascotHide = $.el "div",
      id: "mascot_hide"
      className: "reply"
      <%= html('Hide Categories <span class="drop-marker"></span><div></div>') %>

    keys = Object.keys Mascots
    keys.sort()

    if mode is 'default'
      mascotoptions = $.el 'div',
        id: 'mascot-options'
        <%= html('<a class="edit" href="javascript:;">Edit</a><a class="delete" href="javascript:;">Delete</a><a class="export" href="javascript:;">Export</a>') %>

      $.on $('.edit',   mascotoptions), 'click', cb.edit
      $.on $('.delete', mascotoptions), 'click', cb.delete
      $.on $('.export', mascotoptions), 'click', cb.export

      addoptions = ->
        return if mascotoptions.parentElement is @
        $.add @, mascotoptions

      # Create a keyed Unordered List Element and hide option for each mascot category.
      for name in MascotTools.categories
        menu = $ 'div', mascotHide
        categories[name] = div = $.el "div",
          id:        name
          className: "mascots-container"
          <%= html('<h3 class="mascotHeader">${name}</h3>') %>
          hidden:    name in Conf["Hidden Categories"]

        option = UI.checkbox name, name, name in Conf["Hidden Categories"]

        $.on $('input', option), 'change', cb.category

        $.add suboptions, div
        $.add menu, option

      for name in keys
        continue if name in Conf["Deleted Mascots"]
        mascot = Mascots[name]
        mascotEl = $.el 'div',
          id:        name
          className: if name in Conf[g.MASCOTSTRING] then 'mascot enabled' else 'mascot'

        $.extend div, <%= importHTML('Settings/Mascot') %>

        $.on mascotEl, 'click', cb.select
        $.on mascotEl, 'mouseover', addoptions

        $.add (categories[mascot.category] or categories[MascotTools.categories[0]]), mascotEl

      batchmascots = $.el 'div',
        id: "mascots_batch"

      $.extend batchmascots, <%= importHTML('Settings/Batch-Mascot') %>

      $.on $('#clear', batchmascots), 'click', ->
        enabledMascots = JSON.parse(JSON.stringify(Conf[g.MASCOTSTRING]))
        for name in enabledMascots
          $.rmClass $.id(name), 'enabled'
        $.set g.MASCOTSTRING, Conf[g.MASCOTSTRING] = []

      $.on $('#selectAll', batchmascots), 'click', ->
        for name, mascot of Mascots
          unless mascot.category in Conf["Hidden Categories"] or name in Conf[g.MASCOTSTRING] or name in Conf["Deleted Mascots"]
            $.addClass $.id(name), 'enabled'
            Conf[g.MASCOTSTRING].push name
        $.set g.MASCOTSTRING, Conf[g.MASCOTSTRING]

      $.on $('#createNew', batchmascots), 'click', ->
        MascotTools.dialog()
        Settings.close()

      $.on $("#importMascot", batchmascots), 'click', ->
        @nextSibling.click()

      $.on $("#importMascotButton", batchmascots), 'change', MascotTools.importMascot

      $.on $('#undelete', batchmascots), 'click', ->
        unless Conf["Deleted Mascots"].length > 0
          alert "No mascots have been deleted."
          return
        mascots =
          open:            Settings.mascots
          hyphenatedTitle: 'mascots'
        Settings.openSection.apply mascots, ['restore']

    else
      container = $.el "div",
        className: "mascots"

      for name in keys when name in Conf["Deleted Mascots"]
        mascot = Mascots[name]
        mascotEl = $.el 'div',
          className: 'mascot'
          id: name

        $.extend mascotEl, <%= importHTML('Settings/Mascot') %>

        $.on mascotEl, 'click', cb.restore

        $.add container, mascotEl

      $.add suboptions, container

      batchmascots = $.el 'div',
        id: "mascots_batch"
        <%= html('<a href="javascript:;" id="return">Return</a>') %>

      $.on $('#return', batchmascots), 'click', ->
        mascots =
          open:            Settings.mascots
          hyphenatedTitle: 'mascots'
        Settings.openSection.apply mascots

    for node in [suboptions, batchmascots, mascotHide]
      Rice.nodes node

    $.add section, [suboptions, batchmascots, mascotHide]

  cb:
    style:
      checked: ->
        $.cb.checked.call @
        return if @name in ['NSFW/SFW Themes', 'NSFW/SFW Mascots']
        hyphenated = @name.toLowerCase().replace(/^4/, 'four').replace /\s+/g, '-'
        (if @checked then $.addClass else $.rmClass) doc, hyphenated

      value: ->
        $.cb.value.call @
        Style.sheets.dynamic.textContent = Style.dynamic()

      select: ->
        $.cb.value.call @
        for option in @options
          hyphenated = "#{@name} #{option.value}".toLowerCase().replace(/^4/, 'four').replace /\s+/g, '-'
          (if option.value is @value then $.addClass else $.rmClass) doc, hyphenated
        return

    mascot:
      category: ->
        if $.id(@name).hidden = @checked
          Conf["Hidden Categories"].push @name

          # Gather all names of enabled mascots in the hidden category in every context it could be enabled.
          for type in ["Enabled Mascots", "Enabled Mascots sfw", "Enabled Mascots nsfw"]
            setting = Conf[type]
            i = setting.length

            while i--
              name = setting[i]
              continue unless Mascots[name].category is @name
              setting.splice i, 1
              continue unless type is g.MASCOTSTRING
              $.rmClass $.id(name), 'enabled'
              if Conf['mascot'] is name
                cb = MascotTools.toggle
            $.set type, setting

        else
          $.remove Conf["Hidden Categories"], @name

        $.set "Hidden Categories", Conf["Hidden Categories"]

        cb() if cb

      edit: (e) ->
        e.stopPropagation()
        MascotTools.dialog @parentElement.parentElement.id
        Settings.close()

      delete: (e) ->
        e.stopPropagation()
        name = @parentElement.parentElement.id
        if confirm "Are you sure you want to delete \"#{name}\"?"
          if Conf['mascot'] is name
            MascotTools.toggle()
          for type in ["Enabled Mascots", "Enabled Mascots sfw", "Enabled Mascots nsfw"]
            $.remove Conf[type], name
            $.set type, Conf[type]
          Conf["Deleted Mascots"].push name
          $.set "Deleted Mascots", Conf["Deleted Mascots"]
          $.rm $.id name

      export: (e) ->
        e.stopPropagation()
        name = @parentElement.parentElement.id
        data = Mascots[name]
        data['Mascot'] = name

        a = $.el 'a',
          className: 'export-button'
          textContent: 'Save me!'
          download: "#{name}-#{Date.now()}.json"
          href: "data:application/json;base64,#{btoa unescape encodeURIComponent JSON.stringify data, null, 2}"
          target: '_blank'
        <% if (type !== 'userscript') { %>
        a.click()
        <% } else { %>
        # XXX Firefox won't let us download automatically.
        $.on a, 'click', (e) ->
          e.stopPropagation()
        $.add @parentElement.parentElement, a
        <% } %>

      restore: ->
        if confirm "Are you sure you want to restore \"#{@id}\"?"
          $.remove Conf["Deleted Mascots"], @id
          $.set "Deleted Mascots", Conf["Deleted Mascots"]
          $.rm @

      select: ->
        string = g.MASCOTSTRING
        if $.remove Conf[string], @id
          if Conf['mascot'] is @id
            MascotTools.toggle()
        else
          Conf['mascot'] = @id
          Conf[string].push @id
          MascotTools.change Mascots[@id]
        $.toggleClass @, 'enabled'
        $.set string, Conf[string]
        $.set string, Conf[string]

    theme:
      select: ->
        if current = $.id(Conf[g.THEMESTRING])
          $.rmClass current, 'selectedtheme'

        $.set g.THEMESTRING, Conf[g.THEMESTRING] = @id
        $.addClass @, 'selectedtheme'
        Style.setTheme Themes[@id]

      edit: (e) ->
        e.preventDefault()
        e.stopPropagation()
        ThemeTools.init @name
        Settings.close()

      export: (e) ->
        e.preventDefault()
        e.stopPropagation()
        data = Themes[@name]
        data['Theme'] = @name

        a = $.el 'a',
          textContent: '>>Save me!'
          download: "#{@name}-#{Date.now()}.json"
          href: "data:application/json;base64,#{btoa unescape encodeURIComponent JSON.stringify data, null, 2}"
          target: '_blank'
        <% if (type !== 'userscript') { %>
        a.click()
        <% } else { %>
        # XXX Firefox won't let us download automatically.
        $.on a, 'click', (e) ->
          e.stopPropagation()
        $.replace @, a
        <% } %>

      delete: (e) ->
        e.preventDefault()
        e.stopPropagation()
        container = $.id @name

        unless container.previousSibling or container.nextSibling
          alert "Cannot delete theme (No other themes available)."
          return

        if confirm "Are you sure you want to delete \"#{@name}\"?"
          if @name is Conf[g.THEMESTRING]
            if settheme = container.previousSibling or container.nextSibling
              Conf[g.THEMESTRING] = settheme.id
              $.addClass settheme, 'selectedtheme'
              $.set g.THEMESTRING, Conf[g.THEMESTRING]
          Themes[@name]["Deleted"] = true

          $.get "userThemes", {}, ({userThemes}) =>
            userThemes[@name] = Themes[@name]
            $.set 'userThemes', userThemes
            $.rm container

      restore: ->
        if confirm "Are you sure you want to restore \"#{@id}\"?"
          Themes[@id]["Deleted"] = false

          $.get "userThemes", {}, ({userThemes}) =>
            userThemes[@id] = Themes[@id]
            $.set 'userThemes', userThemes
            $.rm @
