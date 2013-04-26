Settings =
  init: ->
    # 4chan X settings link
    link = $.el 'a',
      className:   'settings-link'
      textContent: 'Settings'
      href:        'javascript:;'
    $.on link, 'click', Settings.open

    Header.addShortcut link

    $.get 'previousversion', null, (item) ->
      if previous = item['previousversion']
        return if previous is g.VERSION
        # Avoid conflicts between sync'd newer versions
        # and out of date extension on this device.
        prev = previous.match(/\d+/g).map Number
        curr = g.VERSION.match(/\d+/g).map Number

        changelog = '<%= meta.repo %>blob/<%= meta.mainBranch %>/CHANGELOG.md'
        el = $.el 'span',
          innerHTML: "<%= meta.name %> has been updated to <a href='#{changelog}' target=_blank>version #{g.VERSION}</a>."
        new Notification 'info', el, 30
      else
        $.on d, '4chanXInitFinished', Settings.open
      $.set
        lastupdate: Date.now()
        previousversion: g.VERSION

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
    $.off d, '4chanXInitFinished', Settings.open
    return if Settings.dialog
    $.event 'CloseMenu'

    html = """
        <nav>
          <div class=sections-list></div>
          <p class='imp-exp-result warning'></p>
          <div class=credits>
              <a class=export>Export</a> |
              <a class=import>Import</a> |
              <input type=file style='display: none;'>
            <a href='<%= meta.page %>' target=_blank><%= meta.name %></a> |
            <a href='<%= meta.repo %>blob/<%= meta.mainBranch %>/CHANGELOG.md' target=_blank>#{g.VERSION}</a> |
            <a href='<%= meta.repo %>blob/<%= meta.mainBranch %>/README.md#reporting-bugs-and-suggestions' target=_blank>Issues</a> |
            <a href=javascript:; class=close title=Close>×</a>
          </div>
        </nav>
        <div class=section-container><section></section></div>
    """

    Settings.overlay = overlay = $.el 'div',
      id: 'overlay'

    Settings.dialog = dialog = $.el 'div',
      id:        'fourchanx-settings'
      className: 'dialog'
      innerHTML: html

    $.on $('.export', Settings.dialog), 'click',  Settings.export
    $.on $('.import', Settings.dialog), 'click',  Settings.import
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

    d.body.style.width = "#{d.body.clientWidth}px"
    $.addClass d.body, 'unscroll'
    $.add d.body, [overlay, dialog]

  close: ->
    return unless Settings.dialog
    d.body.style.removeProperty 'width'
    $.rmClass d.body, 'unscroll'
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

  main: (section) ->
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
    output = $('.imp-exp-result')
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
      <select name=filter>
        <option value=guide>Guide</option>
        <option value=name>Name</option>
        <option value=uniqueID>Unique ID</option>
        <option value=tripcode>Tripcode</option>
        <option value=capcode>Capcode</option>
        <option value=email>E-mail</option>
        <option value=subject>Subject</option>
        <option value=comment>Comment</option>
        <option value=flag>Flag</option>
        <option value=filename>Filename</option>
        <option value=dimensions>Image dimensions</option>
        <option value=filesize>Filesize</option>
        <option value=MD5>Image MD5</option>
      </select>
      <div></div>
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
      <div class=warning #{if Conf['Filter'] then 'hidden' else ''}><code>Filter</code> is disabled.</div>
      <p>
        Use <a href=https://developer.mozilla.org/en/JavaScript/Guide/Regular_Expressions>regular expressions</a>, one per line.<br>
        Lines starting with a <code>#</code> will be ignored.<br>
        For example, <code>/weeaboo/i</code> will filter posts containing the string `<code>weeaboo</code>`, case-insensitive.<br>
        MD5 filtering uses exact string matching, not regular expressions.
      </p>
      <ul>You can use these settings with each regular expression, separate them with semicolons:
        <li>
          Per boards, separate them with commas. It is global if not specified.<br>
          For example: <code>boards:a,jp;</code>.
        </li>
        <li>
          Filter OPs only along with their threads (`only`), replies only (`no`), or both (`yes`, this is default).<br>
          For example: <code>op:only;</code>, <code>op:no;</code> or <code>op:yes;</code>.
        </li>
        <li>
          Overrule the `Show Stubs` setting if specified: create a stub (`yes`) or not (`no`).<br>
          For example: <code>stub:yes;</code> or <code>stub:no;</code>.
        </li>
        <li>
          Highlight instead of hiding. You can specify a class name to use with a userstyle.<br>
          For example: <code>highlight;</code> or <code>highlight:wallpaper;</code>.
        </li>
        <li>
          Highlighted OPs will have their threads put on top of board pages by default.<br>
          For example: <code>top:yes;</code> or <code>top:no;</code>.
        </li>
      </ul>
    """

  sauce: (section) ->
    section.innerHTML = """
      <div class=warning #{if Conf['Sauce'] then 'hidden' else ''}><code>Sauce</code> is disabled.</div>
      <div>Lines starting with a <code>#</code> will be ignored.</div>
      <div>You can specify a display text by appending <code>;text:[text]</code> to the URL.</div>
      <ul>These parameters will be replaced by their corresponding values:
        <li><code>%TURL</code>: Thumbnail URL.</li>
        <li><code>%URL</code>: Full image URL.</li>
        <li><code>%MD5</code>: MD5 hash.</li>
        <li><code>%board</code>: Current board.</li>
      </ul>
      <textarea name=sauces class=field spellcheck=false></textarea>
    """
    sauce = $ 'textarea', section
    $.get 'sauces', Conf['sauces'], (item) ->
      sauce.value = item['sauces']
    $.on sauce, 'change', $.cb.value

  advanced: (section) ->
    section.innerHTML = """
      <fieldset>
        <legend>Archiver</legend>
        Select an Archiver for this board:
        <select name=archiver></select>
      </fieldset>
      <fieldset>
        <legend>Custom Board Navigation</span></legend>
        <div><input name=boardnav class=field spellcheck=false></div>
        <div>In the following, <code>board</code> can translate to a board ID (<code>a</code>, <code>b</code>, etc...), the current board (<code>current</code>), or the Status/Twitter link (<code>status</code>, <code>@</code>).</div>
        <div>
          For example:<br>
          <code>[ toggle-all ] [current-title] [g-title / a-title / jp-title] [x / wsg / h] [t-text:"Piracy"]</code><br>
          will give you<br>
          <code>[ + ] [Technology] [Technology / Anime & Manga / Otaku Culture] [x / wsg / h] [Piracy]</code><br>
          if you are on /g/.
        </div>
        <div>Board link: <code>board</code></div>
        <div>Title link: <code>board-title</code></div>
        <div>Board link (Replace with title when on that board): <code>board-replace</code></div>
        <div>Full text link: <code>board-full</code></div>
        <div>Custom text link: <code>board-text:"VIP Board"</code></div>
        <div>Index-only link: <code>board-index</code></div>
        <div>Catalog-only link: <code>board-catalog</code></div>
        <div>Combinations are possible: <code>board-index-text:"VIP Index"</code></div>
        <div>Full board list toggle: <code>toggle-all</code></div>
      </fieldset>

      <fieldset>
        <legend>Time Formatting <span class=warning #{if Conf['Time Formatting'] then 'hidden' else ''}>is disabled.</span></legend>
        <div><input name=time class=field spellcheck=false>: <span class=time-preview></span></div>
        <div>Supported <a href=//en.wikipedia.org/wiki/Date_%28Unix%29#Formatting>format specifiers</a>:</div>
        <div>Day: <code>%a</code>, <code>%A</code>, <code>%d</code>, <code>%e</code></div>
        <div>Month: <code>%m</code>, <code>%b</code>, <code>%B</code></div>
        <div>Year: <code>%y</code></div>
        <div>Hour: <code>%k</code>, <code>%H</code>, <code>%l</code>, <code>%I</code>, <code>%p</code>, <code>%P</code></div>
        <div>Minute: <code>%M</code></div>
        <div>Second: <code>%S</code></div>
      </fieldset>

      <fieldset>
        <legend>Quote Backlinks formatting <span class=warning #{if Conf['Quote Backlinks'] then 'hidden' else ''}>is disabled.</span></legend>
        <div><input name=backlink class=field spellcheck=false>: <span class=backlink-preview></span></div>
      </fieldset>

      <fieldset>
        <legend>File Info Formatting <span class=warning #{if Conf['File Info Formatting'] then 'hidden' else ''}>is disabled.</span></legend>
        <div><input name=fileInfo class=field spellcheck=false>: <span class='fileText file-info-preview'></span></div>
        <div>Link: <code>%l</code> (truncated), <code>%L</code> (untruncated), <code>%T</code> (Unix timestamp)</div>
        <div>Original file name: <code>%n</code> (truncated), <code>%N</code> (untruncated), <code>%t</code> (Unix timestamp)</div>
        <div>Spoiler indicator: <code>%p</code></div>
        <div>Size: <code>%B</code> (Bytes), <code>%K</code> (KB), <code>%M</code> (MB), <code>%s</code> (4chan default)</div>
        <div>Resolution: <code>%r</code> (Displays 'PDF' for PDF files)</div>
      </fieldset>

      <fieldset>
        <legend>Unread Favicon <span class=warning #{if Conf['Unread Favicon'] then 'hidden' else ''}>is disabled.</span></legend>
        <select name=favicon>
          <option value=ferongr>ferongr</option>
          <option value=xat->xat-</option>
          <option value=Mayhem>Mayhem</option>
          <option value=Original>Original</option>
        </select>
        <span class=favicon-preview></span>
      </fieldset>

      <fieldset>
        <legend>Emoji <span class=warning #{if Conf['Emoji'] then 'hidden' else ''}>is disabled.</span></legend>
        <div>
          Sage Icon: <select name=sageEmoji>
            <option value="4chan SS">4chan SS</option>
            <option value="appchan">appchan</option>
          </select>
          <span class=sage-icon-preview></span>
        </div>
        <div>
          Position: <select name=emojiPos>
            <option value="before">Before</option>
            <option value="after">After</option>
          </select>
        </div>
      </fieldset>

      <fieldset>
        <legend>Thread Updater <span class=warning #{if Conf['Thread Updater'] then 'hidden' else ''}>is disabled.</span></legend>
        <div>
          Interval: <input type=number name=Interval class=field min=1 value=#{Conf['Interval']}>
        </div>
      </fieldset>

      <fieldset>
        <legend>
          <label><input type=checkbox name='Custom CSS' #{if Conf['Custom CSS'] then 'checked' else ''}> Custom CSS</label>
        </legend>
        <button id=apply-css>Apply CSS</button>
        <textarea name=usercss class=field spellcheck=false #{if Conf['Custom CSS'] then '' else 'disabled'}></textarea>
      </fieldset>
    """
    items = {}
    inputs = {}
    for name in ['boardnav', 'time', 'backlink', 'fileInfo', 'favicon', 'sageEmoji', 'emojiPos', 'usercss']
      input = $ "[name=#{name}]", section
      items[name]  = Conf[name]
      inputs[name] = input
      event = if ['favicon', 'usercss', 'sageEmoji', 'emojiPos'].contains name
        'change'
      else
        'input'
      $.on input, event, $.cb.value

    # Archiver
    archiver = $ 'select[name=archiver]', section
    toSelect = Redirect.select g.BOARD.ID
    toSelect = ['No Archive Available'] unless toSelect[0]

    $.add archiver, $.el('option', {textContent: name}) for name in toSelect

    if toSelect[1]
      Conf['archivers'][g.BOARD]
      archiver.value = Conf['archivers'][g.BOARD] or toSelect[0]
      $.on archiver, 'change', ->
        Conf['archivers'][g.BOARD] = @value
        $.set 'archivers', Conf.archivers

    $.get items, (items) ->
      for key, val of items
        continue if ['usercss', 'emojiPos', 'archiver'].contains key
        input = inputs[key]
        input.value = val
        $.on input, event, Settings[key]
        Settings[key].call input
      return

    $.on $('input[name=Interval]', section), 'input', ThreadUpdater.cb.interval
    $.on $('input[name="Custom CSS"]', section), 'change', Settings.togglecss
    $.on $.id('apply-css'), 'click', Settings.usercss
  boardnav: ->
    Header.generateBoardList @value
  time: ->
    funk = Time.createFunc @value
    @nextElementSibling.textContent = funk Time, new Date()
  backlink: ->
    @nextElementSibling.textContent = Conf['backlink'].replace /%id/, '123456789'
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
    Unread.update() if g.VIEW is 'thread' and Conf['Unread Favicon']
    @nextElementSibling.innerHTML = """
      <img src=#{Favicon.default}>
      <img src=#{Favicon.unreadSFW}>
      <img src=#{Favicon.unreadNSFW}>
      <img src=#{Favicon.unreadDead}>
      """
  sageEmoji: ->
    @nextElementSibling.innerHTML = """
      <img src=data:image/png;base64,#{Emoji.sage[@value]}>
      """
  togglecss: ->
    if $('textarea[name=usercss]', $.x 'ancestor::fieldset[1]', @).disabled = !@checked
      CustomCSS.rmStyle()
    else
      CustomCSS.addStyle()
    $.cb.checked.call @
  usercss: ->
    CustomCSS.update()

  keybinds: (section) ->
    section.innerHTML = """
      <div class=warning #{if Conf['Keybinds'] then 'hidden' else ''}><code>Keybinds</code> are disabled.</div>
      <div>Allowed keys: <kbd>a-z</kbd>, <kbd>0-9</kbd>, <kbd>Ctrl</kbd>, <kbd>Shift</kbd>, <kbd>Alt</kbd>, <kbd>Meta</kbd>, <kbd>Enter</kbd>, <kbd>Esc</kbd>, <kbd>Up</kbd>, <kbd>Down</kbd>, <kbd>Right</kbd>, <kbd>Left</kbd>.</div>
      <div>Press <kbd>Backspace</kbd> to disable a keybind.</div>
      <table><tbody>
        <tr><th>Actions</th><th>Keybinds</th></tr>
      </tbody></table>
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