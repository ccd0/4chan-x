ThemeOptions =
  init: (key) ->
    editMode = true
    unless newTheme
      Style.addStyle userThemes[key]
    @dialog key

  dialog: (key) ->
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
          innerHTML: "<div class=optionname>#{item}</div><div class=option><input class=field name='#{item}' placeholder='#{item}' value='#{editTheme[item]}'>"
        $.on $('input', div), 'blur', ->
          editTheme[@name] = @value
          Style.addStyle(editTheme)
        $.add $("#themecontent", dialog), div
    else
      for item in layout
        div = $.el "div",
          className: "themevar"
          innerHTML: "<div class=optionname>#{item}</div><div class=option><input class=field name='#{item}' placeholder='#{item}' value='#{editTheme[item]}'>"
        $.on $('input', div), 'blur', ->
          editTheme[@name] = @value
          Style.addStyle(editTheme)
        $.add $("#themecontent", dialog), div
    $.on $('#save > a', dialog), 'click', ->
      ThemeOptions.save editTheme
    $.on  $('#cancel > a', dialog), 'click', ThemeOptions.close
    if newTheme then Style.addStyle(editTheme)
    $.add d.body, dialog

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
    newTheme = false

    ThemeOptions.close()

    alert "Theme \"#{name}\" saved."

  close: ->
    newTheme = false
    Conf['Edit Mode'] = false
    $.rm $("#themeConf", d.body)
    Style.addStyle Conf["Style"]