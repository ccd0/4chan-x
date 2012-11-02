###
  ThemeTools.color adapted from 4chan Style Script
###
ThemeTools =
  init: (key) ->
    Conf['editMode'] = "theme"

    if userThemes[key]
      editTheme = JSON.parse(JSON.stringify(userThemes[key]))
      editTheme["Theme"] = key
    else
      editTheme = {}
      editTheme["Theme"] = "Untitled"
      editTheme["Author"] = "Author"
      editTheme["Author Tripcode"] = "Unknown"

    # Objects are not guaranteed to have any type of arrangement, so we use a presorted
    # array to generate the layout of of the theme editor.
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
            value: ThemeTools.colorToHex input.value

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
          @nextSibling.value = ThemeTools.colorToHex @value
          @nextSibling.color.importColor()

        editTheme[@name] = @value
        Style.addStyle(editTheme)


      $.add themecontent, div

    div = $.el "div",
      className: "themevar"
      innerHTML: "<div class=optionname><label><input type=checkbox name='Dark Theme' #{if editTheme['Dark Theme'] then 'checked' else ''}><b>Dark Theme?</b></label></div>"

    $.on $('input', div), 'click', ->
      editTheme[@name] = @checked
      Style.addStyle(editTheme)

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

  color: (hex) ->
    @hex = "#" + hex

    @calc_rgb = (hex) ->
      rgb = []
      hex = parseInt hex, 16
      rgb[0] = (hex >> 16) & 0xFF
      rgb[1] = (hex >> 8) & 0xFF
      rgb[2] = hex & 0xFF
      return rgb;

    @private_rgb = @calc_rgb(hex)

    @rgb = @private_rgb.join ","

    @isLight = ->
      @private_rgb[0] + @private_rgb[1] + @private_rgb[2] >= 400

    @shiftRGB = (shift, smart) ->
      rgb = @private_rgb.slice 0
      shift = if smart
        if @isLight rgb
          if shift < 0
            shift
          else
            -shift
        else
          Math.abs shift

      else
        shift;

      rgb[0] = Math.min Math.max(rgb[0] + shift, 0), 255
      rgb[1] = Math.min Math.max(rgb[1] + shift, 0), 255
      rgb[2] = Math.min Math.max(rgb[2] + shift, 0), 255
      return rgb.join ","

    @hover = @shiftRGB 16, true

  colorToHex: (color) ->
    if color.substr(0, 1) is '#'
      return color
    if digits = /(.*?)rgba?\((\d+), ?(\d+), ?(\d+)(.*?)\)/.exec color

      red   = parseInt digits[2], 10
      green = parseInt digits[3], 10
      blue  = parseInt digits[4], 10

      rgb = blue | (green << 8) | (red << 16)
      hex = '#' + rgb.toString 16
      
      while hex.length < 4
        hex += 0
      
      hex

    else return

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

      if userThemes[name] and not userThemes[name]["Deleted"]
        if confirm "A theme with this name already exists. Would you like to over-write?"
          delete userThemes[name]
        else
          return

      if origin == "oneechan" or origin == "SS"
        bgColor     = new ThemeTools.color(imported.bgColor);
        mainColor   = new ThemeTools.color(imported.mainColor);
        brderColor  = new ThemeTools.color(imported.brderColor);
        inputColor  = new ThemeTools.color(imported.inputColor);
        inputbColor = new ThemeTools.color(imported.inputbColor);
        blinkColor  = new ThemeTools.color(imported.blinkColor);
        jlinkColor  = new ThemeTools.color(imported.jlinkColor);
        linkColor   = new ThemeTools.color(imported.linkColor);
        linkHColor  = new ThemeTools.color(imported.linkHColor);
        nameColor   = new ThemeTools.color(imported.nameColor);
        quoteColor  = new ThemeTools.color(imported.quoteColor);
        sageColor   = new ThemeTools.color(imported.sageColor);
        textColor   = new ThemeTools.color(imported.textColor);
        titleColor  = new ThemeTools.color(imported.titleColor);
        tripColor   = new ThemeTools.color(imported.tripColor);
        timeColor   = new ThemeTools.color(imported.timeColor || imported.textColor);

        if imported.bgRPA
          bgRPA = imported.bgRPA.split(' ')
        else
          bgRPA = ['no-repeat', 'bottom', 'left', 'fixed']

        if origin == "oneechan"
          userThemes[name] = {
            'Author'                      : "Author"
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
            'Shadow Color'                : 'rgba(' + mainColor.shiftRGB(16) + ',.9)'
            'Dark Theme'                  : if mainColor.isLight then false else true
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
          userThemes[name] = {
            'Author'                      : "Author"
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
            'Shadow Color'                : 'rgba(' + mainColor.shiftRGB(-16) + ',.9)'
            'Dark Theme'                  : if mainColor.isLight then false else true
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
        userThemes[name] = imported

      $.set 'userThemes', userThemes
      alert "Theme \"#{name}\" imported!"
      $.rm $("#themes", d.body)
      Options.themeTab()

    reader.readAsText(file)

  save: (theme) ->
    name = theme["Theme"]
    delete theme["Theme"]

    if userThemes[name] and not userThemes[name]["Deleted"]
      if confirm "A theme with this name already exists. Would you like to over-write?"
        delete userThemes[name]
      else
        return

    theme["Customized"] = true
    userThemes[name] = theme
    $.set 'userThemes', userThemes
    $.set "theme", name
    alert "Theme \"#{name}\" saved."

  close: ->
    Conf['editMode'] = false
    $.rm $("#themeConf", d.body)
    Style.addStyle()
    Options.dialog("theme")