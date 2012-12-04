###
  Style.color adapted from 4chan Style Script
###
ThemeTools =
  init: (key) ->
    Conf['editMode'] = "theme"

    if Themes[key]
      editTheme = JSON.parse(JSON.stringify(Themes[key]))
      if ($.get "userThemes", {})[key]
        editTheme["Theme"] = key
      else
        editTheme["Theme"] = key += " [custom]"
    else
      editTheme = {}
      editTheme["Theme"] = "Untitled"
      editTheme["Author"] = "Author"
      editTheme["Author Tripcode"] = "Unknown"

    # Objects are not guaranteed to have any type of arrangement, so we use a presorted
    # array to generate the layout of of the theme editor.
    # (Themes aren't even guaranteed to have any of these values, actually)
    layout = [
      "Background Image"
      "Background Attachment"
      "Background Position"
      "Background Repeat"
      "Background Color"
      "Thread Wrapper Background"
      "Thread Wrapper Border"
      "Dialog Background"
      "Dialog Border"
      "Reply Background"
      "Reply Border"
      "Highlighted Reply Background"
      "Highlighted Reply Border"
      "Backlinked Reply Outline"
      "Input Background"
      "Input Border"
      "Hovered Input Background"
      "Hovered Input Border"
      "Focused Input Background"
      "Focused Input Border"
      "Checkbox Background"
      "Checkbox Border"
      "Checkbox Checked Background"
      "Buttons Background"
      "Buttons Border"
      "Navigation Background"
      "Navigation Border"
      "Links"
      "Hovered Links"
      "Quotelinks"
      "Backlinks"
      "Navigation Links"
      "Hovered Navigation Links"
      "Names"
      "Tripcodes"
      "Emails"
      "Subjects"
      "Text"
      "Inputs"
      "Post Numbers"
      "Greentext"
      "Sage"
      "Board Title"
      "Timestamps"
      "Warnings"
      "Shadow Color"
    ]

    ThemeTools.dialog = $.el "div",
      id: "themeConf"
      className: "reply dialog"
      innerHTML: "
<div id=themebar>
</div>
<hr>
<div id=themecontent>
</div>
<div id=save>
  <a href='javascript:;'>Save</a>
</div>
<div id=upload>
  <a href='javascript:;'>Select Image</a>
</div>
<div id=close>
  <a href='javascript:;'>Close</a>
</div>
"

    header = $.el "div",
      innerHTML: "
<input class='field subject' name='Theme' placeholder='Theme' value='#{key}'> by
<input class='field name' name='Author' placeholder='Author' value='#{editTheme['Author']}'>
<input class='field postertrip' name='Author Tripcode' placeholder='Author Tripcode' value='#{editTheme['Author Tripcode']}'>"

    #Setup inputs that are not generated from the layout variable.
    for input in $$("input", header)
      $.on input, 'blur', ->
        editTheme[@name] = @value
    $.add $("#themebar", ThemeTools.dialog), header
    themecontent = $("#themecontent", ThemeTools.dialog)

    for item in layout
      unless editTheme[item]
        editTheme[item] = ''

      div = $.el "div",
        className: "themevar"
        innerHTML: "<div class=optionname><b>#{item}</b></div><div class=option><input name='#{item}' placeholder='#{if item == "Background Image" then "Shift+Click to upload image" else item}'>"

      input = $('input', div)

      input.value = editTheme[item]

      switch item
        when "Background Image"
          input.className = 'field'
          fileInput = $.el 'input'
            type: 'file'
            accept:   "image/*"
            title:    "BG Image"
            hidden:   "hidden"

          $.on input, 'click', (evt) ->
            if evt.shiftKey
              @.nextSibling.click()

          $.on fileInput, 'change', (evt) ->
            ThemeTools.uploadImage evt, @

          $.after input, fileInput

        when "Background Attachment" ,"Background Position", "Background Repeat"
          input.className = 'field'

        else
          input.className = "colorfield"

          colorInput = $.el 'input'
            className: 'color'
            value: "##{Style.colorToHex input.value}"

          JSColor.bind colorInput

          $.after input, colorInput

      $.on input, 'blur', ->
        depth = 0

        unless @.value.length > 1000
          for i in [0..@value.length - 1]
            switch @value[i]
              when '(' then depth++
              when ')' then depth--
              when '"' then toggle1 = not toggle1
              when "'" then toggle2 = not toggle2

        if depth != 0 or toggle1 or toggle2
          return alert "Syntax error on #{@name}."
          
        if @className == "colorfield"
          @nextSibling.value = "##{Style.colorToHex @value}"
          @nextSibling.color.importColor()

        editTheme[@name] = @value
        Style.addStyle(editTheme)


      $.add themecontent, div

    $.add themecontent, div

    unless editTheme["Custom CSS"]
      editTheme["Custom CSS"] = ""

    div = $.el "div",
      className: "themevar"
      innerHTML: "<div class=optionname><b>Custom CSS</b></div><div class=option><textarea name='Custom CSS' placeholder='Custom CSS'>#{editTheme['Custom CSS']}</textarea>"

    $.on $('textarea', div), 'blur', ->
      editTheme["Custom CSS"] = @value
      Style.addStyle(editTheme)

    $.add themecontent, div

    $.on $('#save > a', ThemeTools.dialog), 'click', ->
      ThemeTools.save editTheme

    $.on  $('#close > a', ThemeTools.dialog), 'click', ThemeTools.close
    $.add d.body, ThemeTools.dialog
    Style.addStyle(editTheme)

  uploadImage: (evt, el) ->
    file = evt.target.files[0]
    reader = new FileReader()

    reader.onload = (evt) ->
      val = 'url("' + evt.target.result + '")'

      el.previousSibling.value = val
      editTheme["Background Image"] = val
      Style.addStyle(editTheme)

    reader.readAsDataURL file

  importtheme: (origin, evt) ->
    file = evt.target.files[0]
    reader = new FileReader()

    reader.onload = (e) ->

      try
        imported = JSON.parse e.target.result
      catch err
        alert err
        return

      unless (origin != 'appchan' and imported.mainColor) or (origin == 'appchan' and imported["Author Tripcode"])
        alert "Theme file is invalid."
        return
      name = imported.name or imported["Theme"]
      delete imported.name

      if Themes[name] and not Themes[name]["Deleted"]
        if confirm "A theme with this name already exists. Would you like to over-write?"
          delete Themes[name]
        else
          return

      if origin == "oneechan" or origin == "SS"
        bgColor     = new Style.color(imported.bgColor);
        mainColor   = new Style.color(imported.mainColor);
        brderColor  = new Style.color(imported.brderColor);
        inputColor  = new Style.color(imported.inputColor);
        inputbColor = new Style.color(imported.inputbColor);
        blinkColor  = new Style.color(imported.blinkColor);
        jlinkColor  = new Style.color(imported.jlinkColor);
        linkColor   = new Style.color(imported.linkColor);
        linkHColor  = new Style.color(imported.linkHColor);
        nameColor   = new Style.color(imported.nameColor);
        quoteColor  = new Style.color(imported.quoteColor);
        sageColor   = new Style.color(imported.sageColor);
        textColor   = new Style.color(imported.textColor);
        titleColor  = new Style.color(imported.titleColor);
        tripColor   = new Style.color(imported.tripColor);
        timeColor   = new Style.color(imported.timeColor || imported.textColor);

        if imported.bgRPA
          bgRPA = imported.bgRPA.split(' ')
        else
          bgRPA = ['no-repeat', 'bottom', 'left', 'fixed']

        if origin == "oneechan"
          Themes[name] = {
            'Author'                      : "Anonymous"
            'Author Tripcode'             : "!POMF.9waa"
            'Background Image'            : 'url("' + (imported.bgImg or '') + '")'
            'Background Attachment'       : bgRPA[3] or ''
            'Background Position'         : ((bgRPA[1] + " ") or '') + (bgRPA[2] or '')
            'Background Repeat'           : bgRPA[0] or ''
            'Background Color'            : 'rgb(' + bgColor.rgb + ')'
            'Dialog Background'           : 'rgba(' + mainColor.rgb + ',.98)'
            'Dialog Border'               : 'rgb(' + brderColor.rgb + ')'
            'Thread Wrapper Background'   : 'rgba(0,0,0,0)'
            'Thread Wrapper Border'       : 'rgba(0,0,0,0)'
            'Reply Background'            : 'rgba(' + mainColor.rgb + ',' + imported.replyOp + ')'
            'Reply Border'                : 'rgb(' + brderColor.rgb + ')'
            'Highlighted Reply Background': 'rgba(' + mainColor.shiftRGB(4, true) + ',' + imported.replyOp + ')'
            'Highlighted Reply Border'    : 'rgb(' + linkColor.rgb + ')'
            'Backlinked Reply Outline'    : 'rgb(' + linkColor.rgb + ')'
            'Checkbox Background'         : 'rgba(' + inputColor.rgb + ',' + imported.replyOp + ')'
            'Checkbox Border'             : 'rgb(' + inputbColor.rgb + ')'
            'Checkbox Checked Background' : 'rgb(' + inputColor.rgb + ')'
            'Input Background'            : 'rgba(' + inputColor.rgb + ',' + imported.replyOp + ')'
            'Input Border'                : 'rgb(' + inputbColor.rgb + ')'
            'Hovered Input Background'    : 'rgba(' + inputColor.hover + ',' + imported.replyOp + ')'
            'Hovered Input Border'        : 'rgb(' + inputbColor.rgb + ')'
            'Focused Input Background'    : 'rgba(' + inputColor.hover + ',' + imported.replyOp + ')'
            'Focused Input Border'        : 'rgb(' + inputbColor.rgb + ')'
            'Buttons Background'          : 'rgba(' + inputColor.rgb + ',' + imported.replyOp + ')'
            'Buttons Border'              : 'rgb(' + inputbColor.rgb + ')'
            'Navigation Background'       : 'rgba(' + bgColor.rgb + ',0.8)'
            'Navigation Border'           : 'rgb(' + mainColor.rgb + ')'
            'Quotelinks'                  : 'rgb(' + linkColor.rgb + ')'
            'Links'                       : 'rgb(' + linkColor.rgb + ')'
            'Hovered Links'               : 'rgb(' + linkHColor.rgb + ')'
            'Navigation Links'            : 'rgb(' + textColor.rgb + ')'
            'Hovered Navigation Links'    : 'rgb(' + linkHColor.rgb + ')'
            'Subjects'                    : 'rgb(' + titleColor.rgb + ')'
            'Names'                       : 'rgb(' + nameColor.rgb + ')'
            'Sage'                        : 'rgb(' + sageColor.rgb + ')'
            'Tripcodes'                   : 'rgb(' + tripColor.rgb + ')'
            'Emails'                      : 'rgb(' + linkColor.rgb + ')'
            'Post Numbers'                : 'rgb(' + linkColor.rgb + ')'
            'Text'                        : 'rgb(' + textColor.rgb + ')'
            'Backlinks'                   : 'rgb(' + linkColor.rgb + ')'
            'Greentext'                   : 'rgb(' + quoteColor.rgb + ')'
            'Board Title'                 : 'rgb(' + textColor.rgb + ')'
            'Timestamps'                  : 'rgb(' + timeColor.rgb + ')'
            'Inputs'                      : 'rgb(' + textColor.rgb + ')'
            'Warnings'                    : 'rgb(' + sageColor.rgb + ')'
            'Shadow Color'                : 'rgba(0,0,0,0.1)'
            'Custom CSS'                  : """
.rice {
  box-shadow:rgba(""" + mainColor.shiftRGB(32) + """,.3) 0 1px;
}
input[type=password]:hover,
input[type=text]:not([disabled]):hover,
input#fs_search:hover,
input.field:hover,
.webkit select:hover,
textarea:hover,
#options input:not([type=checkbox]):hover {
  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;
}
input[type=password]:focus,
input[type=text]:focus,
input#fs_search:focus,
input.field:focus,
.webkit select:focus,
textarea:focus,
#options input:focus {
  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;
}
button,
input,
textarea,
.rice {
  transition:background .2s,box-shadow .2s;
}""" + (imported.customCSS or '') }

        else if origin == "SS"
          Themes[name] = {
            'Author'                      : "Anonymous"
            'Author Tripcode'             : "!.pC/AHOKAg"
            'Background Image'            : 'url("' + (imported.bgImg or '') + '")'
            'Background Attachment'       : bgRPA[3] or ''
            'Background Position'         : ((bgRPA[1] + " ") or '') + (bgRPA[2] or '')
            'Background Repeat'           : bgRPA[0] or ''
            'Background Color'            : 'rgb(' + bgColor.rgb + ')'
            'Dialog Background'           : 'rgba(' + mainColor.rgb + ',.98)'
            'Dialog Border'               : 'rgb(' + brderColor.rgb + ')'
            'Thread Wrapper Background'   : 'rgba(' + mainColor.rgb + ',.5)'
            'Thread Wrapper Border'       : 'rgba(' + brderColor.rgb + ',.9)'
            'Reply Background'            : 'rgba(' + mainColor.rgb + ',.9)'
            'Reply Border'                : 'rgb(' + brderColor.rgb + ')'
            'Highlighted Reply Background': 'rgba(' + mainColor.shiftRGB(4, true) + ',.9)'
            'Highlighted Reply Border'    : 'rgb(' + linkColor.rgb + ')'
            'Backlinked Reply Outline'    : 'rgb(' + linkColor.rgb + ')'
            'Checkbox Background'         : 'rgba(' + inputColor.rgb + ',.9)'
            'Checkbox Border'             : 'rgb(' + inputbColor.rgb + ')'
            'Checkbox Checked Background' : 'rgb(' + inputColor.rgb + ')'
            'Input Background'            : 'rgba(' + inputColor.rgb + ',.9)'
            'Input Border'                : 'rgb(' + inputbColor.rgb + ')'
            'Hovered Input Background'    : 'rgba(' + inputColor.hover + ',.9)'
            'Hovered Input Border'        : 'rgb(' + inputbColor.rgb + ')'
            'Focused Input Background'    : 'rgba(' + inputColor.hover + ',.9)'
            'Focused Input Border'        : 'rgb(' + inputbColor.rgb + ')'
            'Buttons Background'          : 'rgba(' + inputColor.rgb + ',.9)'
            'Buttons Border'              : 'rgb(' + inputbColor.rgb + ')'
            'Navigation Background'       : 'rgba(' + bgColor.rgb + ',0.8)'
            'Navigation Border'           : 'rgb(' + mainColor.rgb + ')'
            'Quotelinks'                  : 'rgb(' + linkColor.rgb + ')'
            'Links'                       : 'rgb(' + linkColor.rgb + ')'
            'Hovered Links'               : 'rgb(' + linkHColor.rgb + ')'
            'Navigation Links'            : 'rgb(' + textColor.rgb + ')'
            'Hovered Navigation Links'    : 'rgb(' + linkHColor.rgb + ')'
            'Subjects'                    : 'rgb(' + titleColor.rgb + ')'
            'Names'                       : 'rgb(' + nameColor.rgb + ')'
            'Sage'                        : 'rgb(' + sageColor.rgb + ')'
            'Tripcodes'                   : 'rgb(' + tripColor.rgb + ')'
            'Emails'                      : 'rgb(' + linkColor.rgb + ')'
            'Post Numbers'                : 'rgb(' + linkColor.rgb + ')'
            'Text'                        : 'rgb(' + textColor.rgb + ')'
            'Backlinks'                   : 'rgb(' + linkColor.rgb + ')'
            'Greentext'                   : 'rgb(' + quoteColor.rgb + ')'
            'Board Title'                 : 'rgb(' + textColor.rgb + ')'
            'Timestamps'                  : 'rgb(' + timeColor.rgb + ')'
            'Inputs'                      : 'rgb(' + textColor.rgb + ')'
            'Warnings'                    : 'rgb(' + sageColor.rgb + ')'
            'Shadow Color'                : 'rgba(0,0,0,0.1)'
            'Custom CSS'                  : """
.board {
  padding: 1px 2px;
}
.rice {
  box-shadow:rgba(""" + mainColor.shiftRGB(32) + """,.3) 0 1px;
}
input[type=password]:hover,
input[type=text]:not([disabled]):hover,
input#fs_search:hover,
input.field:hover,
.webkit select:hover,
textarea:hover,
#options input:not([type=checkbox]):hover {
  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;
}
input[type=password]:focus,
input[type=text]:focus,
input#fs_search:focus,
input.field:focus,
.webkit select:focus,
textarea:focus,
#options input:focus {
  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;
}
button,
input,
textarea,
.rice {
  transition:background .2s,box-shadow .2s;
}""" + (imported.customCSS or '') }

      else if origin == 'appchan'
        Themes[name] = imported

      userThemes = $.get "userThemes", {}
      userThemes[name] = Themes[name]
      $.set 'userThemes', userThemes
      alert "Theme \"#{name}\" imported!"
      $.rm $("#themes", d.body)
      Options.themeTab()

    reader.readAsText(file)

  save: (theme) ->
    name = theme["Theme"]

    if Themes[name] and not Themes[name]["Deleted"]
      if confirm "A theme with this name already exists. Would you like to over-write?"
        delete Themes[name]
      else
        return

    Themes[name] = JSON.parse(JSON.stringify(theme))
    delete Themes[name]["Theme"]
    userThemes = $.get "userThemes", {}
    userThemes[name] = Themes[name]
    $.set 'userThemes', userThemes
    $.set "theme", Conf['theme'] = name
    alert "Theme \"#{name}\" saved."

  close: ->
    Conf['editMode'] = false
    $.rm $("#themeConf", d.body)
    Style.addStyle()
    Options.dialog("theme")