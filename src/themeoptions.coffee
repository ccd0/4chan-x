ThemeTools =
  init: (key) ->
    unless Conf["Style"]
      alert "Please enable Style Options and reload the page to use Theme Tools."
      return
    editMode = true
    unless newTheme
      Style.addStyle userThemes[key]
    if newTheme
      editTheme = {}
      editTheme["Theme"] = "Untitled"
      editTheme["Author"] = "Author"
      editTheme["Author Tripcode"] = "Unknown"
    else
      editTheme = userThemes[key]
      editTheme["Theme"] = key
    layout = ["Background Image", "Background Attachment", "Background Position", "Background Repeat", "Background Color", "Thread Wrapper Background", "Thread Wrapper Border", "Dialog Background", "Dialog Border", "Reply Background", "Reply Border", "Highlighted Reply Background", "Highlighted Reply Border", "Backlinked Reply Outline", "Input Background", "Input Border", "Checkbox Background", "Checkbox Border", "Checkbox Checked Background", "Buttons Background", "Buttons Border", "Focused Input Background", "Focused Input Border", "Hovered Input Background", "Hovered Input Border", "Navigation Background", "Navigation Border", "Quotelinks", "Backlinks", "Links", "Hovered Links", "Navigation Links", "Hovered Navigation Links", "Names", "Tripcodes", "Emails", "Subjects", "Text", "Inputs", "Post Numbers", "Greentext", "Sage", "Board Title", "Timestamps", "Warnings", "Shadow Color", "Dark Theme", "Custom CSS"]

    dialog = $.el "div",
      id: "themeConf"
      className: "reply dialog"
      innerHTML: "
<div id=themebar>
</div>
<hr>
<div id=themecontent>
</div>
<div id=save>
  <a href='javascript:;'>Save Theme</a>
</div>
<div id=cancel>
  <a href='javascript:;'>Cancel</a>
</div>
"

    header = $.el "div",
      innerHTML: "
<input class='field subject' name='Theme' placeholder='Theme' value='#{key}'> by
<input class='field name' name='Author' placeholder='Author' value='#{editTheme['Author']}'>
<input class='field postertrip' name='Author Tripcode' placeholder='Author Tripcode' value='#{editTheme['Author Tripcode']}'>"
    for input in $$("input", header)
      $.on input, 'blur', ->
        editTheme[@name] = @value
    $.add $("#themebar", dialog), header
    if newTheme
      for item in layout
        editTheme[item] = ""
        div = $.el "div",
          className: "themevar"
          innerHTML: "<div class=optionname>#{item}</div><div class=option><input class=field name='#{item}' placeholder='#{item}'>"
        $.on $('input', div), 'blur', ->
          editTheme[@name] = @value
          Style.addStyle(editTheme)
        $.add $("#themecontent", dialog), div
    else
      for item in layout
        div = $.el "div",
          className: "themevar"
          innerHTML: "<div class=optionname>#{item}</div><div class=option><input type=text class=field name='#{item}' placeholder='#{item}' value='#{editTheme[item]}'>"
        $.on $('input', div), 'blur', ->
          depth = 0
          for i in [0..@value.length - 1]
            switch @value[i]
              when '(' then depth++
              when ')' then depth--
              when '"' then toggle1 = not toggle1
              when "'" then toggle2 = not toggle2
          if depth != 0 or toggle1 or toggle2
            return alert "Syntax error on #{@name}."
          editTheme[@name] = @value
          Style.addStyle(editTheme)
        $.add $("#themecontent", dialog), div
    $.on $('#save > a', dialog), 'click', ->
      ThemeTools.save editTheme
    $.on  $('#cancel > a', dialog), 'click', ThemeTools.close
    if newTheme then Style.addStyle(editTheme)
    $.add d.body, dialog

  color: (hex) ->
    @hex = "#" + hex
    @private_rgb = (hex) ->
      rgb = []
      hex = parseInt hex, 16
      rgb[0] = (hex >> 16) & 0xFF
      rgb[1] = (hex >> 8) & 0xFF
      rgb[2] = hex & 0xFF
      return rgb;
    @rgb = @private_rgb.join ","
    @isLight = (rgb) ->
      rgb[0] + rgb[1] + rgb[2] >= 400
    @shiftRGB = (shift, smart) ->
      rgb = @private_rgb.slice 0
      shift = if smart
        if @isLight
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

  save: (theme) ->
    name = theme["Theme"]
    delete theme["Theme"]
    if userThemes[name] and not userThemes[name]["Deleted"]
      if confirm "A theme with this name already exists. Would you like to over-write?"
        delete userThemes[name]
      else
        return
    userThemes[name] = theme
    $.set 'userThemes', userThemes
    $.set "Style", name
    Conf["Style"] = name
    ThemeTools.close()
    alert "Theme \"#{name}\" saved."

  close: ->
    newTheme = false
    editMode = false
    $.rm $("#themeConf", d.body)
    Style.addStyle Conf["Style"]
    Options.dialog("theme")