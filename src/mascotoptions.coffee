MascotTools =
  init: ->

    if Conf['Post Form Style'] == "fixed" or Conf['Post Form Style'] == "transparent fade"
      mascotposition = 248
    else
      mascotposition = 0

    #If we're editting anything, let's not change mascots any time we change a value.
    unless editMode
      mascotnames = []

      for name, mascot of userMascots
        if mascot["Enabled"]
          mascotnames.push name

      unless Conf["mascot"] = mascotnames[Math.floor(Math.random() * mascotnames.length)]
        return

      mascot = userMascots[Conf["mascot"]]
      @addMascot mascot

    else
      unless mascot = editMascot or mascot = userMascots[Conf["mascot"]]
        return

    result = "
#mascot img {
  position: fixed;
  z-index:  " + (if Conf['Mascots Overlap Posts'] then '3' else '-1') + ";
  bottom:   " + (if mascot.position == 'bottom' then ( (mascot.vOffset or 0) + 0 + "px") else if mascot.position == 'top' then "auto" else ((mascot.vOffset or 0) + mascotposition) + "px") + ";
  right:    " + ((mascot.hOffset or 0) + (if (Conf['Sidebar'] == 'large' and mascot.center) then 25 else 0)) + "px;
  top:      " + (if mascot.position == 'top' then (mascot.vOffset or 0) + "px" else 'auto') + ";
  left:     auto;
  pointer-events: none;
}
"

    return result


  dialog: (key) ->
    editMode = "mascot"
    editMascot = userMascots[key] or {}
    editMascot.name = key or ''
    MascotTools.addMascot editMascot
    Style.addStyle Conf["theme"]
    layout =
      name: [
        "Mascot Name"
        ""
        "The name of the Mascot"
        "text"
      ]
      image: [
        "Image"
        ""
        "Image of Mascot. Accepts Base64 as well as URLs."
        "text"
      ]
      position: [
        "Position"
        "default"
        "Where the mascot is anchored in the Sidebar. The default option places the mascot above the Post Form or on the bottom of the page, depending on the Post Form setting."
        "select"
        ["default", "top", "bottom"]
      ]
      vOffset: [
        "Vertical Offset"
        ""
        "This value moves the mascot vertically away from the anchor point, in pixels (the post form is exactly \"248\" pixels tall if you'd like to force the mascot to sit above it)."
        "number"
      ]
      hOffset: [
        "Horizontal Offset"
        ""
        "This value moves the mascot further away from the edge of the screen, in pixels."
        "number"
      ]
      center: [
        "Center Mascot"
        false
        "If this is enabled, Appchan X will attempt to pad the mascot with 25 pixels of Horizontal Offset when the \"Sidebar Setting\" is set to \"large\" in an attempt to \"re-center\" the mascot. If you are having problems placing your mascot properly, ensure this is not enabled."
        "checkbox"
      ]

    dialog = $.el "div",
      id: "mascotConf"
      className: "reply dialog"
      innerHTML: "
<div id=mascotbar>
</div>
<hr>
<div id=mascotcontent>
</div>
<div id=save>
  <a href='javascript:;'>Save Mascot</a>
</div>
<div id=close>
  <a href='javascript:;'>Close</a>
</div>
"
    for name, item of layout

      switch item[3]

        when "text"
          div = @input item, name
          if name == 'image'
            $.on $('input', div), 'blur', ->
              editMascot[@name] = @value
              MascotTools.addMascot editMascot
              Style.addStyle Conf["theme"]
          else
            $.on $('input', div), 'blur', ->
              editMascot[@name] = @value
              Style.addStyle Conf["theme"]

        when "number"
          div = @input item, name
          $.on $('input', div), 'blur', ->
            editMascot[@name] = parseInt @value, 10
            Style.addStyle Conf["theme"]

        when "select"
          optionHTML = "<h2>#{item[0]}</h2><span class=description>#{item[2]}</span><div class=option><select name='#{name}'><br>"
          for option in item[4]
            optionHTML = optionHTML + "<option value=\"#{option}\">#{option}</option>"
          optionHTML = optionHTML + "</select>"
          div = $.el 'div',
            className: "mascotvar"
            innerHTML: optionHTML

          $.on $('select', div), 'change', ->
            editMascot[@name] = @value
            Style.addStyle Conf["theme"]

        when "checkbox"
          value = editMascot[name] or item[1]
          div = $.el "div",
            className: "mascotvar"
            innerHTML: "<h2><label><input type=#{item[3]} class=field name='#{name}' #{if value then 'checked'}>#{item[0]}</label></h2><span class=description>#{item[2]}</span>"
          $.on $('input', div), 'click', ->
            editMascot[@name] = if @checked then true else false
            Style.addStyle Conf["theme"]

      $.add $("#mascotcontent", dialog), div

    $.on $('#save > a', dialog), 'click', ->
      MascotTools.save editMascot

    $.on  $('#close > a', dialog), 'click', MascotTools.close
    Style.rice(dialog)
    $.add d.body, dialog

  input: (item, name) ->
    value = editMascot[name] or item[1]

    div = $.el "div",
      className: "mascotvar"
      innerHTML: "<h2>#{item[0]}</h2><span class=description>#{item[2]}</span><div class=option><input type=#{item[3]} class=field name='#{name}' placeholder='#{item[0]}' value='#{value}'></div>"
    return div

  addMascot: (mascot) ->

    el = $('#mascot', d.body)
    $.rm el if el

    div = $.el 'div',
      id: "mascot"
      innerHTML: "<img src='#{if Array.isArray(mascot.image) then (if userThemes and userThemes[Conf['theme']] and userThemes[Conf['theme']]['Dark Theme'] == '1' and Conf["Style"] then mascot.image[0] else mascot.image[1]) else mascot.image}'>"

    $.ready ->
        $.add d.body, div

  save: (mascot) ->
    aname = mascot.name

    if typeof aname == "undefined" or aname == ""
      alert "Please name your mascot."
      return

    mascot["Deleted"] = false
    delete mascot.name

    if userMascots[aname] and not userMascots[aname]["Deleted"]

      if confirm "A mascot named #{aname} already exists. Would you like to over-write?"
        delete userMascots[aname]
      else
        alert "#{aname} aborted."
        return

    mascot["Customized"] = true;
    mascot["Enabled"]    = true;
    userMascots[aname]   = mascot
    Conf["mascot"]       = aname
    $.set 'userMascots', userMascots
    alert "Mascot \"#{aname}\" saved."

  close: ->
    editMode   = false
    editMascot = {}
    $.rm $("#mascotConf", d.body)
    Style.addStyle Conf["Style"]
    Options.dialog("mascot")
