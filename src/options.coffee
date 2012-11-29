Options =
  init: ->
    unless $.get 'firstrun'
      $.set 'firstrun', true
      # Prevent race conditions
      Favicon.init() unless Favicon.el
      Options.dialog()

    for settings in ['navtopright', 'navbotright']
      a = $.el 'a',
        href: 'javascript:;'
        className: 'settingsWindowLink'
        textContent: 'AppChan X Settings'
      $.on a, 'click', ->
        Options.dialog()
      $.prepend $.id(settings), [$.tn('['), a, $.tn('] ')]

  dialog: (tab) ->
    if Conf['editMode'] is "theme"
      if confirm "Opening the options dialog will close and discard any theme changes made with the theme editor."
        ThemeTools.close()
      return
    if Conf['editMode'] is "mascot"
      if confirm "Opening the options dialog will close and discard any mascot changes made with the mascot editor."
        MascotTools.close()
      return
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
  <div>
    <label for=style_tab>Style</label>
    | <label for=theme_tab>Themes</label>
    | <label for=mascot_tab>Mascots</label>
    | <label for=main_tab>Script</label>
    | <label for=filter_tab>Filter</label>
    | <label for=sauces_tab>Sauce</label>
    | <label for=keybinds_tab>Keybinds</label>
    | <label for=rice_tab>Rice</label>
  </div>
</div>
<div id=content>
  <input type=radio name=tab hidden id=main_tab>
  <div></div>
  <input type=radio name=tab hidden id=sauces_tab>
  <div>
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
  <div>
    <ul>
      Archiver
      <li>Select an Archiver for this board: <select name=archiver></select></li>
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
      Amounts for Optional Increase<br>
      <input name=updateIncrease class=field>
    </ul>
    <div class=warning><code>Custom Navigation</code> is disabled.</div>
    <div id=customNavigation>
    </div>
    <ul>
      <div class=warning><code>Unread Favicon</code> is disabled.</div>
      Unread favicons<br>
      <select name=favicon>
        <option value=ferongr>ferongr</option>
        <option value=xat->xat-</option>
        <option value=Mayhem>Mayhem</option>
        <option value=Original>Original</option>
      </select>
     <span></span>
    </ul>
    <span></span>
  </div>
  <input type=radio name=tab hidden id=keybinds_tab>
  <div>
    <div class=warning><code>Keybinds</code> are disabled.</div>
    <div>Allowed keys: Ctrl, Alt, Meta, a-z, A-Z, 0-9, Up, Down, Right, Left.</div>
    <table><tbody>
      <tr><th>Actions</th><th>Keybinds</th></tr>
    </tbody></table>
  </div>
  <input type=radio name=tab hidden id=style_tab checked>
  <div></div>
  <input type=radio name=tab hidden id=theme_tab>
  <div></div>
  <input type=radio name=tab hidden id=mascot_tab>
  <div></div>
  <input type=radio name=tab hidden onClick="document.location.reload()" id=apply>
  <div>Reloading page with new settings.</div>
</div>'

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
    $.add $('ul:nth-child(2)', dialog), li

    # Filter
    # The filter is a bit weird because it consists of a select, and when that select changes,
    # I pull the correct data from the Options.filter method.
    filter = $ 'select[name=filter]', dialog
    $.on filter, 'change', Options.filter
    
    # Archiver
    archiver = $ 'select[name=archiver]', dialog
    select = Redirect.select()
    for name in select
      return if archiver.length >= select.length
      (option = d.createElement 'option').textContent = name
      $.add archiver, option
    if select[1]
      value = "archiver/#{g.BOARD}/"
      archiver.value = $.get value
      $.on archiver, 'mouseup', ->
        if Redirect.archive[g.BOARD]
          delete Redirect.archive[g.BOARD]
        $.set value, @value
        if select[0] is $.get value
          $.delete value

    # Sauce
    # The sauce HTML is already there, so I just fill up the textarea with data from localstorage
    # and save it on change.
    sauce = $ '#sauces', dialog
    sauce.value = $.get sauce.name, Conf[sauce.name]
    $.on sauce, 'change', $.cb.value

    # Rice
    # See sauce comment above. This is not a goto.
    (back     = $ '[name=backlink]', dialog).value = $.get 'backlink', Conf['backlink']
    (time     = $ '[name=time]',     dialog).value = $.get 'time',     Conf['time']
    (fileInfo = $ '[name=fileInfo]', dialog).value = $.get 'fileInfo', Conf['fileInfo']
    $.on back,     'input', $.cb.value
    $.on back,     'input', Options.backlink
    $.on time,     'input', $.cb.value
    $.on time,     'input', Options.time
    $.on fileInfo, 'input', $.cb.value
    $.on fileInfo, 'input', Options.fileInfo

    favicon = $ 'select[name=favicon]', dialog
    favicon.value = $.get 'favicon', Conf['favicon']
    $.on favicon, 'change', $.cb.value
    $.on favicon, 'change', Options.favicon

    (updateIncrease = $ '[name=updateIncrease]', dialog).value = $.get 'updateIncrease', Conf['updateIncrease']
    $.on updateIncrease, 'input', $.cb.value

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

    # Style
    # Create a div to put everything in filled with a warning that shows if style is disabled.
    div = $.el 'div',
      className: "suboptions"

    # Pull categories from config
    for category, obj of Config.style

      # Create unordered lists for categories.
      ul = $.el 'ul'
        innerHTML: "<h3>#{category}</h3>"

      # Pull options from categories of config
      for optionname, arr of obj

        # Save the description for more readable code.
        description = arr[1]

        # Verify the option variable type. If text, text input, if not text, select.
        # If there is no second array cell, it's a checkbox.
        # And create a list item and fill it
        # Adding the JS to change and save it.
        if arr[2] is 'text'
          li = $.el 'li',
            className: "styleoption"
            innerHTML: "<div class=\"option\"><span class=\"optionlabel\">#{optionname}</span><div style=\"display: none\">#{description}</div></div><div class =\"option\"><input name=\"#{optionname}\" style=\"width: 100%\"></div>"
          styleSetting = $ "input[name='#{optionname}']", li
          styleSetting.value = $.get optionname, Conf[optionname]
          $.on styleSetting, 'blur', ->
            $.cb.value.call @
            Style.addStyle.call @

        else if arr[2]
          liHTML = "<div class=\"option\"><span class=\"optionlabel\">#{optionname}</span><div style=\"display: none\">#{description}</div></div><div class =\"option\"><select name=\"#{optionname}\"></div>"
          for selectoption, optionvalue in arr[2]
            liHTML += "<option value=\"#{selectoption}\">#{selectoption}</option>"
          liHTML += "</select>"
          li = $.el 'li',
            innerHTML: liHTML
            className: "styleoption"
          styleSetting = $ "select[name='#{optionname}']", li
          styleSetting.value = $.get optionname, Conf[optionname]
          $.on styleSetting, 'change', ->
            $.cb.value.call @
            Style.addStyle.call @

        else
          checked = if $.get(optionname, Conf[optionname]) then 'checked' else ''
          li = $.el 'li',
            className: "styleoption"
            innerHTML: "<label><input type=checkbox name=\"#{optionname}\" #{checked}><span class=\"optionlabel\">#{optionname}</span><div style=\"display: none\">#{description}</div></label>"
          $.on $('input', li), 'click', ->
            $.cb.checked.call @
            Style.addStyle.call @

        # Mouseover Labels.
        $.on $(".optionlabel", li), 'mouseover', Options.mouseover

        # No matter what kinda option it is, it'll be a list item, so I separate that from the if...else if... else statements
        $.add ul, li

      # And after I'm done iterating through the category options, I can add the resulting list to the div.
      $.add div, ul

    # And after I'm done iterating through the categories themselves, I can add the resulting div to the dialog
    $.add $('#style_tab + div', dialog), div

    # Themes
    # Because adding new themes clears the whole theme dialog, the dialog is created by its own method.
    @themeTab dialog

    # Mascots
    # Because adding new mascots or changing style settings clears the whole mascot dialog,
    # the dialog is created by its own method.
    $.on $('#mascot_tab', Options.el), 'click', ->
      if el = $.id "mascotContainer"
        $.rm el
      Options.mascotTab.dialog Options.el

    # Indicators for disabled or enabled options that may cause conflicts.
    Options.indicators dialog

    # The overlay over 4chan and under the options dialog you can click to close.
    overlay = $.el 'div', id: 'overlay'
    $.on overlay, 'click', Options.close
    $.add d.body, overlay
    dialog.style.visibility = 'hidden'

    # Rice checkboxes.
    Style.rice dialog
    
    # Add options dialog to the DOM.
    $.add d.body, dialog
    dialog.style.visibility = 'visible'

    # For theme and mascot edit dialogs, mostly. Allows the user to return to the tab that opened the edit dialog.
    if tab
      $("##{tab}_tab", dialog).click()

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


  themeTab: (dialog = Options.el, mode) ->

    unless mode
      mode = 'default'

    parentdiv  = $.el 'div',
      id:        "themeContainer"

    suboptions = $.el 'div',
      className: "suboptions"
      id:        "themes"

    # Get the names of all mascots and sort them alphabetically...
    keys = Object.keys(userThemes)
    keys.sort()

    # And use the sorted list to display all available themes to the user.

    if mode is "default"

      for name in keys
        theme = userThemes[name]

        # Themes aren't actually deleted, but are marked as such.
        # Megaupload did something similar with illegal files and got in trouble for it.
        # I do it like this to allow new themes to be added to the user's appchan x when
        # I update the Themes variable. Otherwise, there would be no way to prevent deleted
        # themes from being readded.
        unless theme["Deleted"]

          # Instead of writing a style sheet for each theme, we hard-code the colors into each preview.
          # 4chan SS / OneeChan also do this, and inspired it here.
          div = $.el 'div',
            className: if name is Conf['theme'] then 'selectedtheme' else ''
            id:        name
            innerHTML: "
<div style='cursor: pointer; position: relative; margin-bottom: 2px; width: 100% !important; box-shadow: none !important; background:#{theme['Reply Background']}!important;border:1px solid #{theme['Reply Border']}!important;color:#{theme['Text']}!important'>
  <span style='color:#{theme['Subjects']}!important; font-weight: 700 !important'> #{name}</span>
  <span style='color:#{theme['Names']}!important; font-weight: 700 !important'> #{theme['Author']}</span>
  <span style='color:#{theme['Sage']}!important'> (SAGE)</span>
  <span style='color:#{theme['Tripcodes']}!important'> #{theme['Author Tripcode']}</span>
  <time style='color:#{theme['Timestamps']}'> 20XX.01.01 12:00 </time>
  <a onmouseout='this.setAttribute(&quot;style&quot;,&quot;color:#{theme['Post Numbers']}!important&quot;)' onmouseover='this.setAttribute(&quot;style&quot;,&quot;color:#{theme['Hovered Links']}!important&quot;)' style='color:#{theme['Post Numbers']}!important;' href='javascript:;'>No.27583594</a>
  <a class=edit name='#{name}' onmouseout='this.setAttribute(&quot;style&quot;,&quot;color:#{theme['Backlinks']}!important; font-weight: 800;&quot;)' onmouseover='this.setAttribute(&quot;style&quot;,&quot; font-weight: 800;color:#{theme['Hovered Links']}!important;&quot;)' style='color:#{theme['Backlinks']}!important; font-weight: 800;' href='javascript:;'> &gt;&gt;edit</a>
  <a class=export name='#{name}' onmouseout='this.setAttribute(&quot;style&quot;,&quot;color:#{theme['Backlinks']}!important; font-weight: 800;&quot;)' onmouseover='this.setAttribute(&quot;style&quot;,&quot;color:#{theme['Hovered Links']}!important; font-weight: 800;&quot;)' style='color:#{theme['Backlinks']}!important; font-weight: 800;' href='javascript:;'> &gt;&gt;export</a>
  <a class=delete onmouseout='this.setAttribute(&quot;style&quot;,&quot;color:#{theme['Backlinks']}!important; font-weight: 800;&quot;)' onmouseover='this.setAttribute(&quot;style&quot;,&quot;color:#{theme['Hovered Links']}!important; font-weight: 800;&quot;)' style='color:#{theme['Backlinks']}!important; font-weight: 800;' href='javascript:;'> &gt;&gt;delete</a>
  <br>
  <blockquote style='margin: 0; padding: 12px 40px'>
    <a style='color:#{theme['Quotelinks']}!important; font-weight: 800;'>&gt;&gt;27582902</a>
    <br>
    Post content is right here.
  </blockquote>
  <h1 style='color: #{theme['Text']}'>Selected</h1>
</div>"

          # Theme Editting. themeoptions.coffee.
          $.on $('a.edit', div), 'click', (e) ->
            e.preventDefault()
            e.stopPropagation()
            ThemeTools.init @.name
            Options.close()

          # Theme Exporting
          $.on $('a.export', div), 'click', (e) ->
            e.preventDefault()
            e.stopPropagation()
            exportTheme = userThemes[@.name]
            exportTheme['Theme'] = @.name
            exportedTheme = "data:application/json," + encodeURIComponent(JSON.stringify(exportTheme))

            if window.open exportedTheme, "_blank"
              return
            else if confirm "Your popup blocker is preventing Appchan X from exporting this theme. Would you like to open the exported theme in this window?"
              window.location exportedTheme

          # Delete Theme.
          $.on $('a.delete', div), 'click', (e) ->
            e.preventDefault()
            e.stopPropagation()
            container = @.parentElement.parentElement

            # We don't let the user delete a theme if there is no other theme available
            # because themes can't function without one.
            unless container.previousSibling or container.nextSibling
              alert "Cannot delete theme (No other themes available)."
              return

            if confirm "Are you sure you want to delete \"#{container.id}\"?"
              if container.id is Conf['theme']
                if settheme = container.previousSibling or container.nextSibling
                  Conf['theme'] = settheme.id
                  $.addClass settheme, 'selectedtheme'
                  $.set 'theme', Conf['theme']
              userThemes[container.id]["Deleted"] = true
              $.set 'userThemes', userThemes
              $.rm container

          $.on div, 'click', Options.selectTheme
          $.add suboptions, div

      div = $.el 'div',
        id:        'addthemes'
        innerHTML: "
<a id=newtheme href='javascript:;'>New Theme</a> /
 <a id=import href='javascript:;'>Import Theme</a><input id=importbutton type=file hidden> /
 <a id=SSimport href='javascript:;'>Import from 4chan SS</a><input id=SSimportbutton type=file hidden> /
 <a id=OCimport href='javascript:;'>Import from Oneechan</a><input id=OCimportbutton type=file hidden> /
 <a id=tUndelete href='javascript:;'>Undelete Theme</a>
  "

      # Create New Theme.
      $.on $("#newtheme", div), 'click', ->
        # We prepare ThemeTools to expect no incoming theme.
        # themeoptions.coffee
        ThemeTools.init "untitled"
        Options.close()

      # Essentially, you can't open a file dialog without a file input,
      # but I don't want to show the user a file input.
      $.on $("#import", div), 'click', ->
        @.nextSibling.click()
      $.on $("#importbutton", div), 'change', (evt) ->
        ThemeTools.importtheme "appchan", evt

      $.on $("#OCimport", div), 'click', ->
        @.nextSibling.click()
      $.on $("#OCimportbutton", div), 'change', (evt) ->
        ThemeTools.importtheme "oneechan", evt

      $.on $("#SSimportbutton", div), 'change', (evt) ->
        ThemeTools.importtheme "SS", evt
      $.on $("#SSimport", div), 'click', ->
        @.nextSibling.click()

      $.on $('#tUndelete', div), 'click', ->
        $.rm $("#themeContainer", d.body)
        Options.themeTab false, 'undelete'

    else

      for name in keys
        theme = userThemes[name]

        if theme["Deleted"]

          div = $.el 'div',
            id:        name
            innerHTML: "
<div style='position: relative; margin-bottom: 2px; width: 100% !important; box-shadow: none !important; background:#{theme['Reply Background']}!important;border:1px solid #{theme['Reply Border']}!important;color:#{theme['Text']}!important'>
  <div class='rice' style='cursor: pointer; width: 12px;height: 12px;margin: 0 3px;vertical-align: middle;display: inline-block;background-color:#{theme['Checkbox Background']};border: 1px solid #{theme['Checkbox Border']};'></div>
  <span style='color:#{theme['Subjects']}!important; font-weight: 700 !important'> #{name}</span>
  <span style='color:#{theme['Names']}!important; font-weight: 700 !important'> #{theme['Author']}</span>
  <span style='color:#{theme['Sage']}!important'> (SAGE)</span>
  <span style='color:#{theme['Tripcodes']}!important'> #{theme['Author Tripcode']}</span>
  <time style='color:#{theme['Timestamps']}'> 20XX.01.01 12:00 </time>
  <a onmouseout='this.setAttribute(&quot;style&quot;,&quot;color:#{theme['Post Numbers']}!important&quot;)' onmouseover='this.setAttribute(&quot;style&quot;,&quot;color:#{theme['Hovered Links']}!important&quot;)' style='color:#{theme['Post Numbers']}!important;' href='javascript:;'>No.27583594</a>
  <br>
  <blockquote style='cursor: pointer; margin: 0; padding: 12px 40px'>
    <a style='color:#{theme['Quotelinks']}!important; font-weight: 800;'>&gt;&gt;27582902</a>
    <br>
    I forgive you for using VLC to open me. ;__;
  </blockquote>
</div>"

          $.on div, 'click', ->
            if confirm "Are you sure you want to undelete \"#{@id}\"?"
              userThemes[@id]["Deleted"] = false
              $.set 'userThemes', userThemes
              $.rm @

          $.add suboptions, div

      div = $.el 'div',
        id:        'addthemes'
        innerHTML: "<a href='javascript:;'>Return</a>"

      $.on $('a', div), 'click', ->
        $.rm $("#themeContainer", d.body)
        Options.themeTab()

    $.add parentdiv, suboptions
    $.add parentdiv, div
    $.add $('#theme_tab + div', dialog), parentdiv
    Options.indicators dialog


  mascotTab:
    dialog: (dialog = Options.el, mode) ->
      ul = {}

      unless mode
        mode = "default"

      parentdiv = $.el "div"
        id: "mascotContainer"

      suboptions = $.el "div",
        className: "suboptions"
        innerHTML: "<div class=warning><code>Mascots</code> are currently disabled. Please enable them in the Style tab to use mascot options.</div>"

      mascotHide = $.el "div"
        id:        "mascot_hide"
        className: "reply"
        innerHTML: "Hide Categories <span></span><div></div>"

      keys = Object.keys(userMascots)
      keys.sort()

      if mode is 'default'
        # Create a keyed Unordered List Element and hide option for each mascot category.
        for category in MascotTools.categories
          ul[category] = $.el "ul",
            className:   "mascots"
            id:          category

          if Conf["Hidden Categories"].contains category
            ul[category].hidden = true

          header = $.el "h3"
            className:   "mascotHeader"
            textContent: category

          option = $.el "label"
            name:     category
            innerHTML: "<input name='#{category}' type=checkbox #{if Conf["Hidden Categories"].contains(category) then 'checked' else ''}>#{category}"

          $.on $('input', option), 'change', ->
            Options.mascotTab.toggle @

          $.add ul[category], header
          $.add suboptions, ul[category]
          $.add $('div', mascotHide), option

        for name in keys
          unless Conf["Deleted Mascots"].contains name
            mascot = userMascots[name]
            li = $.el 'li',
              className: 'mascot'
              id:        name
              innerHTML: "
<div class='mascotname'>#{name.replace /_/g, " "}</div>
<div class='container'><div id='#{name}' class='mAlign #{mascot.category}'><img class=mascotimg src='#{if Array.isArray(mascot.image) then (if userThemes[Conf['theme']]['Dark Theme'] then mascot.image[0] else mascot.image[1]) else mascot.image}'></div></div>
<div class='mascotoptions'><a class=edit name='#{name}' href='javascript:;'>Edit</a><a class=delete name='#{name}' href='javascript:;'>Delete</a><a class=export name='#{name}' href='javascript:;'>Export</a></div>"
            if Conf[g.MASCOTSTRING].contains name
              $.addClass li, 'enabled'

            $.on $('a.edit', li), 'click', (e) ->
              e.stopPropagation()
              MascotTools.dialog @name
              Options.close()

            $.on $('a.delete', li), 'click', (e) ->
              e.stopPropagation()
              container = $.id @name
              if confirm "Are you sure you want to delete \"#{@name}\"?"
                if Conf['mascot'] is @name
                  MascotTools.init()
                for type in ["Enabled Mascots", "Enabled Mascots sfw", "Enabled Mascots nsfw"]
                  Conf[type].remove @name
                  $.set type, Conf[type]
                Conf["Deleted Mascots"].push @name
                $.set "Deleted Mascots", Conf["Deleted Mascots"]
                $.rm container

            # Mascot Exporting
            $.on $('a.export', li), 'click', (e) ->
              e.stopPropagation()
              exportMascot = userMascots[@.name]
              exportMascot['Mascot'] = @.name
              exportedMascot = "data:application/json," + encodeURIComponent(JSON.stringify(exportMascot))

              if window.open exportedMascot, "_blank"
                return
              else if confirm "Your popup blocker is preventing Appchan X from exporting this theme. Would you like to open the exported theme in this window?"
                window.location exportedMascot

            $.on li, 'click', ->
              if Conf[g.MASCOTSTRING].remove @id
                $.rmClass @, 'enabled'
                if Conf['mascot'] is @id
                  MascotTools.init()
              else
                $.addClass @, 'enabled'
                Conf[g.MASCOTSTRING].push @id
                MascotTools.init @id
              $.set "Enabled Mascots", Conf["Enabled Mascots"]

            if MascotTools.categories.contains mascot.category
              $.add ul[mascot.category], li
            else
              $.add ul[MascotTools.categories[0]], li

        batchmascots = $.el 'div',
          id:        "mascots_batch"
          innerHTML: "
  <a href=\"javascript:;\" id=clear>Clear All</a> /
   <a href=\"javascript:;\" id=selectAll>Select All</a> /
   <a href=\"javascript:;\" id=createNew>Add Mascot</a> /
   <a href=\"javascript:;\" id=importMascot>Import Mascot</a><input id=importMascotButton type=file hidden> /
   <a href=\"javascript:;\" id=undelete>Undelete Mascots</a>
  "

        $.on $('#clear', batchmascots), 'click', ->
          enabledMascots = JSON.parse(JSON.stringify(Conf[g.MASCOTSTRING]))
          for name in enabledMascots
            $.rmClass $.id(name), 'enabled'
          $.set g.MASCOTSTRING, Conf[g.MASCOTSTRING] = []

        $.on $('#selectAll', batchmascots), 'click', ->
          for name, mascot of userMascots
            unless Conf["Hidden Categories"].contains(mascot.category) or Conf[g.MASCOTSTRING].contains(name) or Conf["Deleted Mascots"].contains(name)
              $.addClass $.id(name), 'enabled'
              Conf[g.MASCOTSTRING].push name
          $.set g.MASCOTSTRING, Conf[g.MASCOTSTRING]

        $.on $('#createNew', batchmascots), 'click', ->
          MascotTools.dialog()
          Options.close()

        $.on $("#importMascot", batchmascots), 'click', ->
          @.nextSibling.click()

        $.on $("#importMascotButton", batchmascots), 'change', (evt) ->
          MascotTools.importMascot evt

        $.on $('#undelete', batchmascots), 'click', ->
          unless Conf["Deleted Mascots"].length > 0
            alert "No mascots have been deleted."
            return
          $.rm $("#mascotContainer", d.body)
          Options.mascotTab.dialog Options.el, 'undelete'

      else
        ul = $.el "ul",
          className:   "mascots"
          id:          category

        for name in keys
          if Conf["Deleted Mascots"].contains name
            mascot = userMascots[name]
            li = $.el 'li',
              className: 'mascot'
              innerHTML: "
<div class='mascotname'>#{name.replace /_/g, " "}</span>
<div id='#{name}' class='container #{mascot.category}'><img class=mascotimg src='#{if Array.isArray(mascot.image) then (if userThemes[Conf['theme']]['Dark Theme'] then mascot.image[0] else mascot.image[1]) else mascot.image}'></div>
"
            div = $('div', li)

            $.on div, 'click', ->
              container = @.parentElement
              if confirm "Are you sure you want to undelete \"#{@id}\"?"
                Conf["Deleted Mascots"].remove @id
                $.set "Deleted Mascots", Conf["Deleted Mascots"]
                $.rm container

            $.add ul, li

        $.add suboptions, ul

        batchmascots = $.el 'div',
          id:        "mascots_batch"
          innerHTML: "<a href=\"javascript:;\" id=\"return\">Return</a>"

        $.on $('#return', batchmascots), 'click', ->
          $.rm $("#mascotContainer", d.body)
          Options.mascotTab.dialog()

      $.add parentdiv, suboptions
      $.add parentdiv, batchmascots
      $.add parentdiv, mascotHide

      Style.rice parentdiv

      $.add $('#mascot_tab + div', dialog), parentdiv
      Options.indicators dialog

    toggle: (el) ->
      name = el.name
      category = $ "#options .suboptions ##{name}", d.body
      if el.checked
        category.hidden = true
        Conf["Hidden Categories"].push name
        for mName, mascot of userMascots
          if mascot.category is name
            for type in ["Enabled Mascots", "Enabled Mascots sfw", "Enabled Mascots nsfw"]
              if Conf[type].contains mName
                Conf[type].remove mName
                $.set type, Conf[type]
              if type is g.MASCOTSTRING
                $.rmClass $.id(mName).parentElement, 'enabled'
      else
        category.hidden = false
        Conf["Hidden Categories"].remove name
      $.set "Hidden Categories", Conf["Hidden Categories"]

  customNavigation:
    dialog: (dialog) ->
      div = $ "#customNavigation", dialog
      ul = $.el "ul"
      ul.innerHTML = """
  Custom Navigation
  """

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
        textContent: "Navigation Syntax: Display Name | Title / Alternate Text | URL"
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
      addLink = $.el "a"
        textContent: " + "
        href: "javascript:;"
      $.on addLink, "click", ->
        blankLink = ["ex","example","http://www.example.com/"]
        userNavigation.links.push blankLink
        Options.customNavigation.cleanup()

      $.add li, addLink
      $.add ul, li

      $.add div, ul

    cleanup: ->
      $.set "userNavigation", userNavigation
      $.rm $("#customNavigation > ul", d.body)
      Options.customNavigation.dialog $("#options", d.body)

  close: ->
    $.rm $('#options', d.body)
    $.rm $('#overlay', d.body)

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
    el = @nextSibling

    if (name = @value) isnt 'guide'
      ta = $.el 'textarea',
        name: name
        className: 'field'
        value: $.get name, Conf[name]
      $.on ta, 'change', $.cb.value
      $.replace el, ta
      return

    $.rm el if el

    $.after @, $.el 'article',
      innerHTML: '<p>Use <a href=https://developer.mozilla.org/en/JavaScript/Guide/Regular_Expressions>regular expressions</a>, one per line.<br>
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
  </ul>'

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
    @nextElementSibling.innerHTML = "<img src=#{Favicon.unreadSFW}> <img src=#{Favicon.unreadNSFW}> <img src=#{Favicon.unreadDead}>"

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

    # Don't stop other elements from dragging
    return if UI.el

    mouseover = UI.el = $.el 'div',
      id:           'mouseover'
      className:    'reply dialog'
      innerHTML:  @nextSibling.innerHTML

    Options.cb = (e) -> UI.hover e, "menu"
    $.add d.body, mouseover

    $.on @, 'mousemove',      Options.cb
    $.on @, 'mouseout',       Options.mouseout

    return
    
  mouseout: (e) ->
  
    UI.hoverend()
    $.off @, 'mousemove',     Options.cb