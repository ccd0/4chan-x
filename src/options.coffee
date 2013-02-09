Options =
  init: ->
    unless $.get 'firstrun'
      $.set 'firstrun', true
      # Prevent race conditions
      Favicon.init() unless Favicon.el
      Options.dialog()

    a = $.el 'a',
      id:    'settingsWindowLink'
      title: 'Appchan X Settings'
      href:  'javascript:;'
    $.on a, 'click', ->
      Options.dialog()
    $.replace $.id('settingsWindowLink'), a

  dialog: (tab) ->
    dialog = Options.el = $.el 'div'
      id: 'options'
      className: 'reply dialog'
      innerHTML: '<div id=optionsbar>
  <div id=credits>
    <label for=apply>Apply</label>
    | <a target=_blank href=http://zixaphir.github.com/appchan-x/>AppChan X</a>
    | <a target=_blank href=https://raw.github.com/zixaphir/appchan-x/master/changelog>' + Main.version + '</a>
    | <a target=_blank href=http://zixaphir.github.com/appchan-x/#bug-report>Issues</a>
  </div>
  <div class=tabs>
    <label for=main_tab>Main</label><label for=filter_tab>Filter</label><label for=sauces_tab>Sauce</label><label for=keybinds_tab>Keybinds</label><label for=rice_tab>Rice</label>
  </div>
</div>
<div id=optionsContent>
  <input type=radio name=tab hidden id=main_tab checked>
  <div class=main_tab></div>
  <input type=radio name=tab hidden id=sauces_tab>
  <div class=sauces_tab>
    <div class=warning><code>Sauce</code> is disabled.</div>
    Lines starting with a <code>#</code> will be ignored.<br>
    You can specify a certain display text by appending <code>;text:[text]</code> to the url.
    <ul>These parameters will be replaced by their corresponding values:
      <li>$1: Thumbnail url.</li>
      <li>$2: Full image url.</li>
      <li>$3: MD5 hash.</li>
      <li>$4: Current board.</li>
    </ul>
    <textarea name=sauces id=sauces class=field></textarea>
  </div>
  <input type=radio name=tab hidden id=filter_tab>
  <div>
    <div class=warning><code>Filter</code> is disabled.</div>
    <select name=filter>
      <option value=guide>Guide</option>
      <option value=name>Name</option>
      <option value=uniqueid>Unique ID</option>
      <option value=tripcode>Tripcode</option>
      <option value=mod>Admin/Mod</option>
      <option value=email>E-mail</option>
      <option value=subject>Subject</option>
      <option value=comment>Comment</option>
      <option value=country>Country</option>
      <option value=filename>Filename</option>
      <option value=dimensions>Image dimensions</option>
      <option value=filesize>Filesize</option>
      <option value=md5>Image MD5 (uses exact string matching, not regular expressions)</option>
    </select>
  </div>
  <input type=radio name=tab hidden id=rice_tab>
  <div class=rice_tab>
    <ul>
      Archiver
      <li>
        Select an Archiver for this board:
        <select name=archiver></select>
      </li>
    </ul>
    <div class=warning><code>Quote Backlinks</code> are disabled.</div>
    <ul>
      Backlink formatting
      <li><input name=backlink class=field> : <span id=backlinkPreview></span></li>
    </ul>
    <div class=warning><code>Time Formatting</code> is disabled.</div>
    <ul>
      Time formatting
      <li><input name=time class=field> : <span id=timePreview></span></li>
      <li>Supported <a href=http://en.wikipedia.org/wiki/Date_%28Unix%29#Formatting>format specifiers</a>:</li>
      <li>Day: %a, %A, %d, %e</li>
      <li>Month: %m, %b, %B</li>
      <li>Year: %y</li>
      <li>Hour: %k, %H, %l (lowercase L), %I (uppercase i), %p, %P</li>
      <li>Minutes: %M</li>
      <li>Seconds: %S</li>
    </ul>
    <div class=warning><code>File Info Formatting</code> is disabled.</div>
    <ul>
      File Info Formatting
      <li><input name=fileInfo class=field> : <span id=fileInfoPreview class=fileText></span></li>
      <li>Link: %l (lowercase L, truncated), %L (untruncated), %t (Unix timestamp)</li>
      <li>Original file name: %n (truncated), %N (untruncated), %T (Unix timestamp)</li>
      <li>Spoiler indicator: %p</li>
      <li>Size: %B (Bytes), %K (KB), %M (MB), %s (4chan default)</li>
      <li>Resolution: %r (Displays PDF on /po/, for PDFs)</li>
    </ul>
    <ul>
      Specify size of video embeds<br>
      Height: <input name=embedHeight type=number />px
      |
      Width:  <input name=embedWidth  type=number />px
      <button name=resetSize>Reset</button>
    </ul>
    <ul>
      <li>Amounts for Optional Increase</li>
      <li>Visible tab</li>
      <li><input name=updateIncrease class=field></li>
      <li>Background tab</li>
      <li><input name=updateIncreaseB class=field></li>
    </ul>
    <div class=warning><code>Custom Navigation</code> is disabled.</div>
    <div id=customNavigation>
    </div>
    <div class=warning><code>Per Board Persona</code> is disabled.</div>
    <div id=persona>
      <select name=personaboards></select>
      <ul>
        <li>
          <div class=option>
            Name:
          </div>
        </li>
        <li>
          <div class=option>
            <input name=name>
          </div>
        </li>
        <li>
          <div class=option>
            Email:
          </div>
        </li>
        <li>
          <div class=option>
            <input name=email>
          </div>
        </li>
        <li>
          <div class=option>
            Subject:
          </div>
        </li>
        <li>
          <div class=option>
            <input name=sub>
          </div>
        </li>
        <li>
          <button></button>
        </li>
      </ul>
    </div>
    <div class=warning><code>Custom CSS</code> is disabled.</div>
    Remove Comment blocks to use! ( "/*" and "*/" around CSS blocks )
    <textarea name=customCSS id=customCSS class=field></textarea>
    <ul>
      <div class=warning><code>Unread Favicon</code> is disabled.</div>
      Unread favicons<br>
     <span></span>
      <select name=favicon>
        <option value=ferongr>ferongr</option>
        <option value=xat->xat-</option>
        <option value=Mayhem>Mayhem</option>
        <option value=4chanJS>4chanJS</option>
        <option value=Original>Original</option>
      </select>
    </ul>
    <span></span>
  </div>
  <input type=radio name=tab hidden id=keybinds_tab>
  <div class=keybinds_tab>
    <div class=warning><code>Keybinds</code> are disabled.</div>
    <div>Allowed keys: Ctrl, Alt, Meta, a-z, A-Z, 0-9, Up, Down, Right, Left.</div>
    <table><tbody>
      <tr><th>Actions</th><th>Keybinds</th></tr>
    </tbody></table>
  </div>
  <input type=radio name=tab hidden onClick="document.location.reload()" id=apply>
  <div>Reloading page with new settings.</div>
</div>'

    for label in $$ 'label[for]', dialog
      $.on label, 'click', ->
        if previous = $.id 'selected_tab'
          previous.id = ''
        @id = 'selected_tab'

    # Main
    # I start by gathering all of the main configuration category objects
    for key, obj of Config.main
      # and creating an unordered list for the main categories.
      ul = $.el 'ul'
        innerHTML: "<h3>#{key}</h3>"

      # Then I gather the variables from each category
      for key, arr of obj

        # I use the object's key to pull from the Conf variable
        # which is created from the saved localstorage in the "Main" class.
        checked = if $.get(key, Conf[key]) then 'checked' else ''
        description = arr[1]

        # I create a list item to represent the option, with a checkbox to change it.
        li = $.el 'li',
          innerHTML: "<label><input type=checkbox name=\"#{key}\" #{checked}><span class=\"optionlabel\">#{key}</span><div style=\"display: none\">#{description}</div></label>"

        # The option is both changed and saved on click.
        $.on $('input', li), 'click', $.cb.checked

        # Mouseover Labels
        $.on $(".optionlabel", li), 'mouseover', Options.mouseover

        # We add the list item to the unordered list
        $.add ul, li

      # And add the list to the main tab of the options dialog.
      $.add $('#main_tab + div', dialog), ul

    # Clear Hidden button.
    hiddenThreads = $.get "hiddenThreads/#{g.BOARD}/", {}
    hiddenNum = Object.keys(g.hiddenReplies).length + Object.keys(hiddenThreads).length
    li = $.el 'li',
      innerHTML: "<span class=\"optionlabel\"><button>hidden: #{hiddenNum}</button></span><div style=\"display: none\">Forget all hidden posts. Useful if you accidentally hide a post and have \"Show Stubs\" disabled.</div>"
    $.on $('button', li), 'click', Options.clearHidden
    $.on $('.optionlabel', li), 'mouseover', Options.mouseover
    $.add $('ul:nth-child(3)', dialog), li

    # Filter
    # The filter is a bit weird because it consists of a select, and when that select changes,
    # I pull the correct data from the Options.filter method.
    filter = $ 'select[name=filter]', dialog
    $.on filter, 'change', Options.filter

    # Archiver
    archiver = $ 'select[name=archiver]', dialog
    toSelect = Redirect.select g.BOARD
    toSelect = ['No Archive Available'] unless toSelect[0]

    $.add archiver, $.el('option', {textContent: name}) for name in toSelect

    if toSelect[1]
      archiver.value = $.get value = "archiver/#{g.BOARD}/", toSelect[0]
      $.on archiver, 'change', ->
        $.set value, @value

    # Sauce
    # The sauce HTML is already there, so I just fill up the textarea with data from localstorage
    # and save it on change.
    sauce = $ '#sauces', dialog
    sauce.value = $.get sauce.name, Conf[sauce.name]
    $.on sauce, 'change', $.cb.value

    # Rice General
    # See sauce comment above.
    (back     = $ '[name=backlink]', dialog).value = $.get 'backlink', Conf['backlink']
    (time     = $ '[name=time]',     dialog).value = $.get 'time',     Conf['time']
    (fileInfo = $ '[name=fileInfo]', dialog).value = $.get 'fileInfo', Conf['fileInfo']
    $.on back,     'input', $.cb.value
    $.on back,     'input', Options.backlink
    $.on time,     'input', $.cb.value
    $.on time,     'input', Options.time
    $.on fileInfo, 'input', $.cb.value
    $.on fileInfo, 'input', Options.fileInfo

    # Persona
    @persona.select = $ '[name=personaboards]', dialog
    @persona.button = $ '#persona button', dialog
    @persona.data = $.get 'persona',
      global: {}

    unless @persona.data[g.BOARD]
      @persona.data[g.BOARD] = JSON.parse JSON.stringify @persona.data.global

    for name of @persona.data
      @persona.select.innerHTML += "<option value=#{name}>#{name}</option>"

    @persona.select.value = if Conf['Per Board Persona'] then g.BOARD else 'global'
    @persona.init()
    $.on @persona.select, 'change', Options.persona.change

    # Custom CSS
    customCSS = $ '#customCSS', dialog
    customCSS.value = $.get customCSS.name, Conf[customCSS.name]
    $.on customCSS, 'change', ->
      $.cb.value.call @
      Style.addStyle()

    # Embed Dimensions
    (width  = $ '[name=embedWidth]',  dialog).value = $.get 'embedWidth',  Conf['embedWidth']
    (height = $ '[name=embedHeight]', dialog).value = $.get 'embedHeight', Conf['embedHeight']
    $.on width,  'input', $.cb.value
    $.on height, 'input', $.cb.value
    $.on $('[name=resetSize]', dialog), 'click', ->
      $.set 'embedWidth',  width.value  = Config.embedWidth
      $.set 'embedHeight', height.value = Config.embedHeight

    # Favicons
    favicon = $ 'select[name=favicon]', dialog
    favicon.value = $.get 'favicon', Conf['favicon']
    $.on favicon, 'change', $.cb.value
    $.on favicon, 'change', Options.favicon

    # Updater Increase
    (updateIncrease =  $ '[name=updateIncrease]', dialog).value  = $.get 'updateIncrease',  Conf['updateIncrease']
    (updateIncreaseB = $ '[name=updateIncreaseB]', dialog).value = $.get 'updateIncreaseB', Conf['updateIncreaseB']
    $.on updateIncrease,  'input', $.cb.value
    $.on updateIncreaseB, 'input', $.cb.value

    # The custom navigation has its own method. I pass it this dialog so it doesn't have to find the dialog itself
    # (it finds the dialog itself when we change its settings)
    @customNavigation.dialog dialog

    # Keybinds
    # Pull options from Config, fill with options from localstorage.
    for key, arr of Config.hotkeys
      tr = $.el 'tr',
        innerHTML: "<td>#{arr[1]}</td><td><input name=#{key} class=field></td>"
      input = $ 'input', tr
      input.value = $.get key, Conf[key]
      $.on input, 'keydown', Options.keybind
      $.add $('#keybinds_tab + div tbody', dialog), tr

    # The overlay over 4chan and under the options dialog you can click to close.
    overlay = $.el 'div', id: 'overlay'
    $.on overlay, 'click', Options.close
    $.add d.body, overlay
    dialog.style.visibility = 'hidden'

    # Add options dialog to the DOM.
    $.add d.body, dialog
    dialog.style.visibility = 'visible'

    # For theme and mascot edit dialogs, mostly. Allows the user to return to the tab that opened the edit dialog.
    if tab
      $("[for='#{tab}_tab']", dialog).click()

    # Fill values, mostly. See each section for the value of the variable used as an argument.
    # Argument will be treated as 'this' by each method.
    Options.filter.call   filter
    Options.backlink.call back
    Options.time.call     time
    Options.fileInfo.call fileInfo
    Options.favicon.call  favicon

  indicators: (dialog) ->
    indicators = {}
    for indicator in $$ '.warning', dialog
      key = indicator.firstChild.textContent
      indicator.hidden = $.get key, Conf[key]
      indicators[key] = indicator
      $.on $("[name='#{key}']", dialog), 'click', ->
        indicators[@name].hidden = @checked

    for indicator in $$ '.disabledwarning', dialog
      key = indicator.firstChild.textContent
      indicator.hidden = not $.get key, Conf[key]
      indicators[key] = indicator
      $.on $("[name='#{key}']", dialog), 'click', ->
        Options.indicators dialog

    return

  customNavigation:
    dialog: (dialog) ->
      div = $ "#customNavigation", dialog
      ul = $.el "ul"
      ul.innerHTML = "Custom Navigation"

      # Delimiter
      li = $.el "li"
        className: "delimiter"
        textContent: "delimiter: "
      input = $.el "input"
        className: "field"
        name:      "delimiter"
      input.setAttribute "value", userNavigation.delimiter
      input.setAttribute "placeholder", "delimiter"
      input.setAttribute "type", "text"

      $.on input, "change", ->
        if @value is ""
          alert "Custom Navigation options cannot be blank."
          return
        userNavigation.delimiter = @value
        $.set "userNavigation", userNavigation
      $.add li, input
      $.add ul, li

      # Description of Syntax.
      li = $.el "li"
        innerHTML: "Navigation Syntax:<br>Display Name | Title / Alternate Text | URL"
      $.add ul, li

      # Names and Placeholders for custom navigation inputs.
      # These values mirror the positions of values in the navigation link arrays.
      navOptions = ["Display Name", "Title / Alt Text", "URL"]

      # Generate list for custom navigation
      for index, link of userNavigation.links

        # Avoid iterating through prototypes.
        unless typeof link is 'object'
          continue

        # This input holds the index of the current link in the userNavigation array/object.
        li = $.el "li"
        input = $.el "input"
          className: "hidden"
          value:     index
          type:      "hidden"
          hidden:    "hidden"

        $.add li, input

        #Generate inputs for list
        for itemIndex, item of link

          # Avoid iterating through prototypes.
          unless typeof item is 'string'
            continue

          # Fill input with relevant values.
          input = $.el "input"
            className:   "field"
            name:        itemIndex
            value:       item
            placeholder: navOptions[itemIndex]
            type:        "text"

          $.on input, "change", ->
            if @value is ""
              alert "Custom Navigation options cannot be blank."
              return
            userNavigation.links[@parentElement.firstChild.value][@name] = @value
            $.set "userNavigation", userNavigation

          $.add li, input

        # Add Custom Link
        addLink = $.el "a"
          textContent: " + "
          href: "javascript:;"

        $.on addLink, "click", ->
          # Example data for a new link.
          blankLink = ["ex","example","http://www.example.com/"]

          # I add the new link at the position of the link where it was added,
          # pushing the existing links to the next position.
          userNavigation.links.add blankLink, @parentElement.firstChild.value

          # And refresh the link list.
          Options.customNavigation.cleanup()

        # Delete Custom Link
        removeLink = $.el "a"
          textContent: " x "
          href: "javascript:;"

        $.on removeLink, "click", ->
          userNavigation.links.remove userNavigation.links[@parentElement.firstChild.value]
          Options.customNavigation.cleanup()

        $.add li, addLink
        $.add li, removeLink
        $.add ul, li

      # Final addLink Button. Allows the user to add a new item
      # to the bottom of the list or add an item if none exist.
      li = $.el "li"
        innerHTML: "<a name='add' href='javascript:;'>+</a> | <a name='reset' href='javascript:;'>Reset</a>"

      $.on $('a[name=add]', li), "click", ->
        blankLink = ["ex","example","http://www.example.com/"]
        userNavigation.links.push blankLink
        Options.customNavigation.cleanup()

      $.on $('a[name=reset]', li), "click", ->
        userNavigation = JSON.parse JSON.stringify Navigation
        Options.customNavigation.cleanup()

      $.add ul, li

      $.add div, ul

    cleanup: ->
      $.set "userNavigation", userNavigation
      $.rm $("#customNavigation > ul", d.body)
      Options.customNavigation.dialog $("#options", d.body)

  persona:
    init: ->
      key = if Conf['Per Board Persona'] then g.BOARD else 'global'
      Options.persona.newButton()
      for item in Options.persona.array
        input = $ "input[name=#{item}]", Options.el
        input.value = @data[key][item] or ""

        $.on input, 'blur', ->
          pers = Options.persona
          pers.data[pers.select.value][@name] = @value
          $.set 'persona', pers.data
      
      $.on Options.persona.button, 'click', Options.persona.copy

    array: ['name', 'email', 'sub']

    change: ->
      key = @value
      Options.persona.newButton()
      for item in Options.persona.array
        input = $ "input[name=#{item}]", Options.el
        input.value = Options.persona.data[key][item]
      return
    
    copy: ->
      {select, data, change} = Options.persona
      if select.value is 'global'
        data.global = JSON.parse JSON.stringify data[select.value]
      else
        data[select.value] = JSON.parse JSON.stringify data.global
      $.set 'persona', Options.persona.data = data
      change.call select

    newButton: -> 
      Options.persona.button.textContent = "Copy from #{if Options.persona.select.value is 'global' then 'current board' else 'global'}"

  close: ->
    $.rm $.id 'options'
    $.rm $.id 'overlay'
    delete Options.el

  clearHidden: ->
    #'hidden' might be misleading; it's the number of IDs we're *looking* for,
    # not the number of posts actually hidden on the page.
    $.delete "hiddenReplies/#{g.BOARD}/"
    $.delete "hiddenThreads/#{g.BOARD}/"
    @textContent = "hidden: 0"
    g.hiddenReplies = {}

  keybind: (e) ->
    return if e.keyCode is 9
    e.preventDefault()
    e.stopPropagation()
    return unless (key = Keybinds.keyCode e)?
    @value = key
    $.cb.value.call @

  filter: ->
    el = @nextSibling.nextSibling

    if (name = @value) isnt 'guide'
      ta = $.el 'textarea',
        name: name
        className: 'field'
        value: $.get name, Conf[name]
      $.on ta, 'change', $.cb.value
      $.replace el, ta
      return

    article = $.el 'article',
      innerHTML: """
<p>Use <a href=https://developer.mozilla.org/en/JavaScript/Guide/Regular_Expressions>regular expressions</a>, one per line.<br>
  Lines starting with a <code>#</code> will be ignored.<br>
  For example, <code>/weeaboo/i</code> will filter posts containing the string `<code>weeaboo</code>`, case-insensitive.</p>
<ul>You can use these settings with each regular expression, separate them with semicolons:
  <li>
    Per boards, separate them with commas. It is global if not specified.<br>
    For example: <code>boards:a,jp;</code>.
  </li>
  <li>
    Filter OPs only along with their threads (`only`), replies only (`no`, this is default), or both (`yes`).<br>
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
</ul>"""

    if el
      $.replace el, article
    
    else
      $.after @, article

  time: ->
    Time.foo()
    Time.date = new Date()
    $.id('timePreview').textContent = Time.funk Time

  backlink: ->
    $.id('backlinkPreview').textContent = Conf['backlink'].replace /%id/, '123456789'

  fileInfo: ->
    FileInfo.data =
      link:       '//images.4chan.org/g/src/1334437723720.jpg'
      spoiler:    true
      size:       '276'
      unit:       'KB'
      resolution: '1280x720'
      fullname:   'd9bb2efc98dd0df141a94399ff5880b7.jpg'
      shortname:  'd9bb2efc98dd0df141a94399ff5880(...).jpg'
    FileInfo.setFormats()
    $.id('fileInfoPreview').innerHTML = FileInfo.funk FileInfo

  favicon: ->
    Favicon.switch()
    Unread.update true
    @previousElementSibling.innerHTML = "<img src=#{Favicon.unreadSFW}> <img src=#{Favicon.unreadNSFW}> <img src=#{Favicon.unreadDead}>"

  selectTheme: ->
    if currentTheme = $.id(Conf['theme'])
      $.rmClass currentTheme, 'selectedtheme'

    if Conf["NSFW/SFW Themes"]
      $.set "theme_#{g.TYPE}", @id
    else
      $.set "theme", @id
    Conf['theme'] = @id
    $.addClass @, 'selectedtheme'
    Style.addStyle()

  mouseover: (e) ->
    if mouseover = $.id 'mouseover'
      if mouseover is UI.el
        delete UI.el
      $.rm mouseover

    UI.el = mouseover = @nextSibling.cloneNode true
    mouseover.id = 'mouseover'
    mouseover.className = 'dialog'
    mouseover.style.display = ''

    $.on @, 'mousemove',      Options.hover
    $.on @, 'mouseout',       Options.mouseout

    $.add d.body, mouseover

    return

  hover: (e) ->
    UI.hover e, "menu"

  mouseout: (e) ->
    UI.hoverend()
    $.off @, 'mousemove',     Options.hover