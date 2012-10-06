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
        try
          Options.dialog()
        catch err
          $.log err.stack
      $.prepend $.id(settings), [$.tn('['), a, $.tn('] ')]

  dialog: (tab) ->
    if editMode
      if confirm "Opening the options dialog will close and discard any theme changes made with the theme editor."
        try ThemeTools.close()
        try MascotTools.close()
        editMode = false
      else
        return
    dialog = $.el 'div'
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
    <label for=main_tab>Main</label>
    | <label for=filter_tab>Filter</label>
    | <label for=sauces_tab>Sauce</label>
    | <label for=rice_tab>Rice</label>
    | <label for=keybinds_tab>Keybinds</label>
    | <label for=style_tab>Style</label>
    | <label for=theme_tab>Themes</label>
    | <label for=mascot_tab>Mascots</label>
  </div>
</div>
<hr>
<div id=content>
  <input type=radio name=tab hidden id=main_tab checked>
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
      <li>Link (with original file name): %l (lowercase L, truncated), %L (untruncated)</li>
      <li>Original file name: %n (Truncated), %N (Untruncated)</li>
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
  <input type=radio name=tab hidden id=style_tab>
  <div></div>
  <input type=radio name=tab hidden id=theme_tab>
  <div></div>
  <input type=radio name=tab hidden id=mascot_tab>
  <div></div>
  <input type=radio name=tab hidden onClick="javascript:location.reload(true)" id=apply>
  <div>Reloading page with new settings.</div>
</div>'

    #main
    for key, obj of Config.main
      ul = $.el 'ul',
        textContent: key
      for key, arr of obj
        checked = if $.get(key, Conf[key]) then 'checked' else ''
        description = arr[1]
        li = $.el 'li',
          innerHTML: "<label><input type=checkbox name=\"#{key}\" #{checked}><span class=\"optionlabel\">#{key}</span></label><span class=description>: #{description}</span>"
        $.on $('input', li), 'click', $.cb.checked
        $.add ul, li
      $.add $('#main_tab + div', dialog), ul

    hiddenThreads = $.get "hiddenThreads/#{g.BOARD}/", {}
    hiddenNum = Object.keys(g.hiddenReplies).length + Object.keys(hiddenThreads).length
    li = $.el 'li',
      innerHTML: "<button>hidden: #{hiddenNum}</button> <span class=description>: Forget all hidden posts. Useful if you accidentally hide a post and have \"Show Stubs\" disabled."
    $.on $('button', li), 'click', Options.clearHidden
    $.add $('ul:nth-child(2)', dialog), li

    #filter
    filter = $ 'select[name=filter]', dialog
    $.on filter, 'change', Options.filter

    #sauce
    sauce = $ '#sauces', dialog
    sauce.value = $.get sauce.name, Conf[sauce.name]
    $.on sauce, 'change', $.cb.value

    #rice
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
    @customNavigation.dialog dialog

    #keybinds
    for key, arr of Config.hotkeys
      tr = $.el 'tr',
        innerHTML: "<td>#{arr[1]}</td><td><input name=#{key} class=field></td>"
      input = $ 'input', tr
      input.value = $.get key, Conf[key]
      $.on input, 'keydown', Options.keybind
      $.add $('#keybinds_tab + div tbody', dialog), tr

    #style
    div = $.el 'div',
      className: "suboptions"
      innerHTML: "<div class=warning><code>Style</code> is currently disabled. Please enable it in the Main tab to use styling options.</div>"
    for category, obj of Config.style
      ul = $.el 'ul',
        textContent: category
      for optionname, arr of obj
        description = arr[1]
        if arr[2] == 'text'
          li = $.el 'li',
            className: "styleoption"
            innerHTML: "<div class=\"option\"><span class=\"optionlabel\">#{optionname}</span>: <span class=\"description\">#{description}</span></div><div class =\"option\"><input name=\"#{optionname}\" style=\"width: 100%\"></div>"
          styleSetting = $ "input[name='#{optionname}']", li
          styleSetting.value = $.get optionname, Conf[optionname]
          $.on styleSetting, 'change', $.cb.value
          $.on styleSetting, 'change', Options.style
        else if arr[2]
          liHTML = "
          <div class=\"option\"><span class=\"optionlabel\">#{optionname}</span>: <span class=\"description\">#{description}</span></div><div class =\"option\"><select name=\"#{optionname}\"></div>"
          for selectoption, optionvalue in arr[2]
            liHTML = liHTML + "<option value=\"#{selectoption}\">#{selectoption}</option>"
          liHTML = liHTML + "</select>"
          li = $.el 'li',
            innerHTML: liHTML
            className: "styleoption"
          styleSetting = $ "select[name='#{optionname}']", li
          styleSetting.value = $.get optionname, Conf[optionname]
          $.on styleSetting, 'change', $.cb.value
          $.on styleSetting, 'change', Options.style
        else
          checked = if $.get(optionname, Conf[optionname]) then 'checked' else ''
          li = $.el 'li',
            className: "styleoption"
            innerHTML: "<label><input type=checkbox name=\"#{optionname}\" #{checked}><span class=\"optionlabel\">#{optionname}</span><span class=description>: #{description}</span></label>"
          $.on $('input', li), 'click', $.cb.checked
        $.add ul, li
      $.add div, ul
    $.add $('#style_tab + div', dialog), div
    Options.applyStyle(dialog, 'style_tab')

    #themes
    @themeTab dialog

    #mascots
    @mascotTab dialog
    Options.applyStyle(dialog, 'mascot_tab')

    #indicators
    Options.indicators dialog

    if tab
      $("#main_tab", dialog).checked = false
      $("#" + tab + "_tab", dialog).checked = true

    overlay = $.el 'div', id: 'overlay'
    $.on overlay, 'click', Options.close
    $.add d.body, overlay
    dialog.style.visibility = 'hidden'
    if Conf['Style']
      Style.rice dialog
    $.add d.body, dialog
    dialog.style.visibility = 'visible'

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


  themeTab: (dialog, mode) ->

    unless dialog
      dialog = $("#options", d.body)

    unless mode
      mode = 'default'

    parentdiv  = $.el 'div',
      id:        "themeContainer"

    suboptions = $.el 'div',
      className: "suboptions"
      id:        "themes"
      innerHTML: "<div class=warning><code>Style</code> is currently disabled. Please enable it in the Main tab to use theming options.</div>"

    # Get the names of all mascots and sort them alphabetically...
    keys = Object.keys(userThemes)
    keys.sort()

    # And use the sorted list to display all available themes to the user.

    if mode == "default"

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
            className: if name == Conf['theme'] then 'selectedtheme replyContainer' else 'replyContainer'
            id:        name
            innerHTML: "
<div class='reply' style='position: relative; width: 100%; box-shadow: none !important; background-color:#{theme['Reply Background']}!important;border:1px solid #{theme['Reply Border']}!important;color:#{theme['Text']}!important'>
  <div class='rice' style='cursor: pointer; width: 12px;height: 12px;margin: 0 3px;vertical-align: middle;display: inline-block;background-color:#{theme['Checkbox Background']};border: 1px solid #{theme['Checkbox Border']};'></div>
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
  <blockquote style='cursor: pointer; margin: 0; padding: 12px 40px'>
    <a style='color:#{theme['Quotelinks']}!important; font-weight: 800;'>&gt;&gt;27582902</a>
    <br>
    Post content is right here.
  </blockquote>
  <h1 style='color: #{theme['Text']}'>Selected</h1>
</div>"

          # Theme Editting. themeoptions.coffee.
          $.on $('a.edit', div), 'click', ->
            unless Conf["Style"]
              alert "Please enable Style Options and reload the page to use Theme Tools."
              return
            ThemeTools.init @.name
            Options.close()

          # Theme Exporting
          $.on $('a.export', div), 'click', ->
            exportTheme = userThemes[@.name]
            exportTheme['Theme'] = @.name
            exportedTheme = "data:application/json," + encodeURIComponent(JSON.stringify(exportTheme))

            if window.open exportedTheme, "_blank"
              return
            else if confirm "Your popup blocker is preventing Appchan X from exporting this theme. Would you like to open the exported theme in this window?"
              window.location exportedTheme

          # Delete Theme.
          $.on $('a.delete', div), 'click', ->
            container = @.parentElement.parentElement

            # We don't let the user delete a theme if there is no other theme available
            # because themes can't function without one.
            unless container.previousSibling or container.nextSibling
              alert "Cannot delete theme (No other themes available)."
              return

            if confirm "Are you sure you want to delete \"#{container.id}\"?"
              if container.id == Conf['theme']
                if settheme = container.previousSibling or container.nextSibling
                  Conf['theme'] = settheme.id
                  $.addClass settheme, 'selectedtheme'
                  $.set 'theme', Conf['theme']
              userThemes[container.id]["Deleted"] = true
              $.set 'userThemes', userThemes
              $.rm container

          $.on $('.rice', div), 'click', Options.selectTheme
          $.on $('blockquote', div), 'click', Options.selectTheme
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
        unless Conf["Style"]
          alert "Please enable Style Options and reload the page to use Theme Tools."
          return

        # We prepare ThemeTools to expect no incoming theme.
        # themeoptions.coffee
        newTheme = true
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
            className: if name == Conf['theme'] then 'selectedtheme replyContainer' else 'replyContainer'
            id:        name
            innerHTML: "
<div class='reply' style='position: relative; width: 100%; box-shadow: none !important; background-color:#{theme['Reply Background']}!important;border:1px solid #{theme['Reply Border']}!important;color:#{theme['Text']}!important'>
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
    Options.applyStyle(dialog, 'theme_tab')
    Options.indicators dialog


  mascotTab: (dialog, mode) ->
    unless dialog
      dialog = $("#options", d.body)

    unless mode
      mode = 'default'

    parentdiv = $.el 'div'
      id: "mascotContainer"

    suboptions = $.el 'div',
      className: "suboptions"
      innerHTML: "<div class=warning><code>Style</code> is currently disabled. Please enable it in the Main tab to use mascot options.</div><div class=warning><code>Mascots</code> are currently disabled. Please enable them in the Style tab to use mascot options.</div>"

    ul = $.el 'ul',
      className:   'mascots'
    keys = Object.keys(userMascots)
    keys.sort()


    if mode == 'default'

      for name in keys
        unless Conf["Deleted Mascots"].contains name
          mascot = userMascots[name]
          li = $.el 'li',
            className: 'mascot'
            innerHTML: "
<div id='#{name}' class='#{mascot.category}' style='background-image: url(#{if Array.isArray(mascot.image) then (if Conf["Style"] and userThemes[Conf['theme']]['Dark Theme'] then mascot.image[0] else mascot.image[1]) else mascot.image});'></div>
<div class='mascotmetadata'>
  <p><span class='mascotname'>#{name.replace /_/g, " "}</span></p>
  <p><span class='mascotoptions'><a class=edit name='#{name}' href='javascript:;'>Edit</a> / <a class=delete name='#{name}' href='javascript:;'>Delete</a> / <a class=export name='#{name}' href='javascript:;'>Export</a></span></p>
</div>
"
          div = $('div[style]', li)
          if Conf[g.MASCOTSTRING].contains name
            $.addClass div, 'enabled'

          $.on $('a.edit', li), 'click', ->
            unless Conf["Style"]
              alert "Please enable Style Options and reload the page to use Mascot Tools."
              return
            MascotTools.dialog @name
            Options.close()

          $.on $('a.delete', li), 'click', ->
            container = @.parentElement.parentElement.parentElement.parentElement
            if confirm "Are you sure you want to delete \"#{@name}\"?"
              for type in ["Enabled Mascots", "Enabled Mascots sfw", "Enabled Mascots nsfw"]
                Conf[type].remove @name
                $.set type, Conf[type]
              Conf["Deleted Mascots"].push @name
              $.set "Deleted Mascots", Conf["Deleted Mascots"]
              $.rm container

          # Mascot Exporting
          $.on $('a.export', li), 'click', ->
            exportMascot = userMascots[@.name]
            exportMascot['Mascot'] = @.name
            exportedMascot = "data:application/json," + encodeURIComponent(JSON.stringify(exportMascot))

            if window.open exportedMascot, "_blank"
              return
            else if confirm "Your popup blocker is preventing Appchan X from exporting this theme. Would you like to open the exported theme in this window?"
              window.location exportedMascot

          $.on div, 'click', ->
            if Conf[g.MASCOTSTRING].remove @id
              $.rmClass @, 'enabled'
            else
              $.addClass @, 'enabled'
              Conf[g.MASCOTSTRING].push @id
            $.set "Enabled Mascots", Conf["Enabled Mascots"]

          $.add ul, li
          $.add suboptions, ul

      batchmascots = $.el 'div',
        id:        "mascots_batch"
        innerHTML: "
<a href=\"javascript:;\" id=clear>Clear All</a> /
 <a href=\"javascript:;\" id=selectAll>Select All</a> /
 <a href=\"javascript:;\" id=createNew>New Mascot</a> /
 <a href=\"javascript:;\" id=importMascot>Import Mascot</a><input id=importMascotButton type=file hidden> /
 <a href=\"javascript:;\" id=undelete>Undelete Mascots</a>
"

      $.on $('#clear', batchmascots), 'click', ->
        for name in Conf[g.MASCOTSTRING]
            $.rmClass $.id(name), 'enabled'
            Conf[g.MASCOTSTRING].remove name
        $.set g.MASCOTSTRING, Conf[g.MASCOTSTRING]

      $.on $('#selectAll', batchmascots), 'click', ->
        for name, mascot of userMascots
          unless Conf[g.MASCOTSTRING].contains name or Conf["Deleted Mascots"].contains name
            $.addClass $.id(name), 'enabled'
            Conf[g.MASCOTSTRING].push name
        $.set g.MASCOTSTRING, Conf[g.MASCOTSTRING]

      $.on $('#createNew', batchmascots), 'click', ->
        unless Conf["Style"]
          alert "Please enable Style Options and reload the page to use Mascot Tools."
          return
        MascotTools.dialog()
        Options.close()

      $.on $("#importMascot", batchmascots), 'click', ->
        @.nextSibling.click()

      $.on $("#importMascotButton", batchmascots), 'change', (evt) ->
        MascotTools.importMascot evt

      $.on $('#undelete', batchmascots), 'click', ->
        unless Conf["Style"]
          alert "Please enable Style Options and reload the page to use Mascot Tools."
          return
        unless Conf["Deleted Mascots"].length > 0
          alert "No mascots have been deleted."
          return
        $.rm $("#mascotContainer", d.body)
        Options.mascotTab false, 'undelete'

    else

      for name in keys
        if Conf["Deleted Mascots"].contains name
          mascot = userMascots[name]
          li = $.el 'li',
            className: 'mascot'
            innerHTML: "
<div id='#{name}' class='#{mascot.category}' style='background-image: url(#{if Array.isArray(mascot.image) then (if Conf["Style"] and userThemes[Conf['theme']]['Dark Theme'] then mascot.image[0] else mascot.image[1]) else mascot.image});'></div>
<div class='mascotmetadata'>
  <p><span class='mascotname'>#{name.replace /_/g, " "}</span></p>
</div>
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
        Options.mascotTab()

    $.add parentdiv, suboptions
    $.add parentdiv, batchmascots

    $.add $('#mascot_tab + div', dialog), parentdiv
    Options.indicators dialog


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
        if @value == ""
          alert "Custom Navigation options cannot be blank."
          return
        userNavigation.delimiter = @value
        $.set "userNavigation", userNavigation
      $.add li, input
      $.add ul, li

      #Description of Syntax.
      li = $.el "li"
        textContent: "Navigation Syntax: Display Name | Title / Alternate Text | URL"
      $.add ul, li

      # Names and Placeholders for custom navigation inputs.
      navOptions = ["Display Name", "Title / Alt Text", "URL"]

      #Generate list for custom navigation
      for index, link of userNavigation.links
        li = $.el "li"
        input = $.el "input"
          className: "hidden"
        input.setAttribute "value", index
        input.setAttribute "type", "hidden"
        input.setAttribute "hidden", "hidden"
        $.add li, input

        #Generate inputs for list
        for itemIndex, item of link
          input = $.el "input"
            className: "field"
            name:      itemIndex
          input.setAttribute "value", item
          input.setAttribute "placeholder", navOptions[itemIndex]
          input.setAttribute "type", "text"

          $.on input, "change", ->
            if @value == ""
              alert "Custom Navigation options cannot be blank."
              return
            userNavigation.links[@parentElement.firstChild.value][@name] = @value
            $.set "userNavigation", userNavigation

          $.add li, input

        #Add Custom Link
        addLink = $.el "a"
          textContent: " + "
          href: "javascript:;"

        $.on addLink, "click", ->
          userNavigation.links.add = (at) ->
            keep = userNavigation.links.slice at
            userNavigation.links.length = at
            blankLink = ["ex","example","http://www.example.com/"]
            userNavigation.links.push blankLink
            userNavigation.links.push.apply userNavigation.links, keep
          userNavigation.links.add @parentElement.firstChild.value
          delete userNavigation.links.add
          Options.customNavigation.cleanup()

        #Delete Custom Link
        removeLink = $.el "a"
          textContent: " x "
          href: "javascript:;"

        $.on removeLink, "click", ->
          userNavigation.links.remove = (from) ->
            keep = userNavigation.links.slice parseInt(from) + 1
            userNavigation.links.length = from
            userNavigation.links.push.apply userNavigation.links, keep
          userNavigation.links.remove @parentElement.firstChild.value
          delete userNavigation.links.remove
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
      link:       'javascript:;'
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

  applyStyle: (dialog, tab) ->
    if Conf['styleenabled']
      save = $.el 'div',
        innerHTML: '<a href="javascript:;">Save Style Settings</a>'
        className: 'stylesettings'
      $.on $('a', save), 'click', ->
        Style.addStyle()
        $.rm $("#mascot_tab + div > div", d.body)
        Options.mascotTab()
      $.add $('#' + tab + ' + div', dialog), save

  selectTheme: ->
    container = @.parentElement.parentElement

    if currentTheme = $.id(Conf['theme'])
      $.rmClass currentTheme, 'selectedtheme'

    if Conf["NSFW/SFW Themes"]
      $.set "theme_#{g.TYPE}", container.id
    else
      $.set "theme", container.id
    Conf['theme'] = container.id
    $.addClass container, 'selectedtheme'