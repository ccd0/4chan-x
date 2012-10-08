MascotTools =
  init: ->

    if Conf['Mascot Position'] == 'bottom'
      position = 0
    else
      position = 248

    #If we're editting anything, let's not change mascots any time we change a value.
    unless Conf['editMode']
      names = []

      unless Conf["mascot"] = Conf[g.MASCOTSTRING][Math.floor(Math.random() * Conf[g.MASCOTSTRING].length)]
        return

      mascot = userMascots[Conf["mascot"]]
      @addMascot mascot

    else
      unless mascot = editMascot or mascot = userMascots[Conf["mascot"]]
        return

    if Conf["Sidebar Location"] == 'left'
      if Conf["Mascot Location"] == "sidebar"
        location = 'left'
      else
        location = 'right'
    else if Conf["Mascot Location"] == "sidebar"
      location = 'right'
    else
      location = 'left'

    result = """
#mascot img {
  position: fixed;
  z-index: """ + (if Conf['Mascots Overlap Posts'] then '3' else '-1') + """;
  bottom:  """ + (if mascot.position == 'bottom' then ( (mascot.vOffset or 0) + 0 + "px") else if mascot.position == 'top' then "auto" else ((mascot.vOffset or 0) + position) + "px") + """;
  """ + location + """: """ + ((mascot.hOffset or 0) + (if (Conf['Sidebar'] == 'large' and mascot.center) then 25 else 0)) + """px;
  top:     """ + (if mascot.position == 'top' then (mascot.vOffset or 0) + "px" else 'auto') + """;
  height:  """ + (if mascot.height and isNaN parseFloat mascot.height then mascot.height else if mascot.height then parseInt(mascot.height) + "px" else "auto") + """;
  width:   """ + (if mascot.width  and isNaN parseFloat mascot.width  then mascot.width  else if mascot.width  then parseInt(mascot.width)  + "px" else "auto") + """;;
  pointer-events: none;
}
"""

    return result

  categories: [
    "Anime"
    "George"
    "NSFW"
    "Ponies"
    "Silhouette"
  ]

  dialog: (key) ->
    Conf['editMode'] = "mascot"
    if userMascots[key]
      editMascot = JSON.parse(JSON.stringify(userMascots[key]))
    else
      editMascot = {}
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
        "Image of Mascot. Accepts Base64 as well as URLs. Shift+Click field to upload."
        "text"
      ]
      category: [
        "Category"
        MascotTools.categories[0]
        "A general categorization of the mascot."
        "select"
        MascotTools.categories
      ]
      position: [
        "Position"
        "default"
        "Where the mascot is anchored in the Sidebar. The default option places the mascot above the Post Form or on the bottom of the page, depending on the Post Form setting."
        "select"
        ["default", "top", "bottom"]
      ]
      height: [
        "Height"
        "auto"
        "This value is used for manually setting a height for the mascot."
        "text"
      ]
      width: [
        "Width"
        "auto"
        "This value is used for manually setting a width for the mascot."
        "text"
      ]
      vOffset: [
        "Vertical Offset"
        "0"
        "This value moves the mascot vertically away from the anchor point, in pixels (the post form is exactly \"248\" pixels tall if you'd like to force the mascot to sit above it)."
        "number"
      ]
      hOffset: [
        "Horizontal Offset"
        "0"
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
          input = $ 'input', div

          if name == 'image'

            $.on input, 'blur', ->
              editMascot[@name] = @value
              MascotTools.addMascot editMascot
              Style.addStyle Conf["theme"]

            fileInput = $.el 'input'
              type:     "file"
              accept:   "image/*"
              title:    "imagefile"
              hidden:   "hidden"

            $.on input, 'click', (evt) ->
              if evt.shiftKey
                @.nextSibling.click()

            $.on fileInput, 'change', (evt) ->
              MascotTools.uploadImage evt, @

            $.after input, fileInput

          else
            $.on input, 'blur', ->
              editMascot[@name] = @value
              MascotTools.addMascot editMascot
              Style.addStyle Conf["theme"]

        when "number"
          div = @input item, name
          $.on $('input', div), 'blur', ->
            editMascot[@name] = parseInt @value
            MascotTools.addMascot editMascot
            Style.addStyle Conf["theme"]

        when "select"
          value = editMascot[name] or item[1]
          optionHTML = "<h2>#{item[0]}</h2><span class=description>#{item[2]}</span><div class=option><select name='#{name}' value='#{value}'><br>"
          for option in item[4]
            optionHTML = optionHTML + "<option value=\"#{option}\">#{option}</option>"
          optionHTML = optionHTML + "</select>"
          div = $.el 'div',
            className: "mascotvar"
            innerHTML: optionHTML
          setting = $ "select", div
          setting.value = value

          $.on $('select', div), 'change', ->
            editMascot[@name] = @value
            MascotTools.addMascot editMascot
            Style.addStyle Conf["theme"]

        when "checkbox"
          value = editMascot[name] or item[1]
          div = $.el "div",
            className: "mascotvar"
            innerHTML: "<h2><label><input type=#{item[3]} class=field name='#{name}' #{if value then 'checked'}>#{item[0]}</label></h2><span class=description>#{item[2]}</span>"
          $.on $('input', div), 'click', ->
            editMascot[@name] = if @checked then true else false
            MascotTools.addMascot editMascot
            Style.addStyle Conf["theme"]

      $.add $("#mascotcontent", dialog), div

    $.on $('#save > a', dialog), 'click', ->
      MascotTools.save editMascot

    $.on  $('#close > a', dialog), 'click', MascotTools.close
    Style.rice(dialog)
    $.add d.body, dialog

  input: (item, name) ->
    if Array.isArray(editMascot[name])
      if Conf["Style"] and userThemes[Conf['theme']]['Dark Theme'] then value = editMascot[name][0] else value = editMascot[name][1]
    else
      value = editMascot[name] or item[1]

    editMascot[name] = value
    
    div = $.el "div",
      className: "mascotvar"
      innerHTML: "<h2>#{item[0]}</h2><span class=description>#{item[2]}</span><div class=option><input type=#{item[3]} class=field name='#{name}' placeholder='#{item[0]}' value='#{value}'></div>"

    return div

  uploadImage: (evt, el) ->
    file = evt.target.files[0]
    reader = new FileReader()

    reader.onload = (evt) ->
      val = evt.target.result

      el.previousSibling.value = val
      editMascot.image = val
      Style.addStyle Conf["theme"]

    reader.readAsDataURL file

  addMascot: (mascot) ->

    el = $('#mascot', d.body)
    $.rm el if el

    div = $.el 'div',
      id: "mascot"
      innerHTML: "<img src='#{if Array.isArray(mascot.image) then (if Conf["Style"] and userThemes[Conf['theme']]['Dark Theme'] then mascot.image[0] else mascot.image[1]) else mascot.image}'>"

    $.ready ->
        $.add d.body, div

  save: (mascot) ->
    if typeof (aname = mascot.name) == "undefined" or aname == ""
      alert "Please name your mascot."
      return
      
    if typeof mascot.image == "undefined" or mascot.image == ""
      alert "Your mascot must contain an image."
      return
    
    unless mascot.category
      mascot.category = MascotTools.categories[0]

    delete mascot.name

    if userMascots[aname] and not Conf["Deleted Mascots"].remove aname

      if confirm "A mascot named \"#{aname}\" already exists. Would you like to over-write?"
        delete userMascots[aname]
      else
        alert "Creation of \"#{aname}\" aborted."
        return

    for type in ["Enabled Mascots", "Enabled Mascots sfw", "Enabled Mascots nsfw"]
      unless Conf[type].contains aname
        Conf[type].push aname
      $.set type, Conf[type]
    mascot["Customized"] = true;
    userMascots[aname]   = mascot
    Conf["mascot"]       = aname
    $.set 'userMascots', userMascots
    alert "Mascot \"#{aname}\" saved."

  close: ->
    Conf['editMode']   = false
    editMascot = {}
    $.rm $("#mascotConf", d.body)
    Style.addStyle Conf["Style"]
    Options.dialog("mascot")


  importMascot: (evt) ->
    file = evt.target.files[0]
    reader = new FileReader()

    reader.onload = (e) ->

      try
        imported = JSON.parse e.target.result
      catch err
        alert err
        return

      unless (imported["Mascot"])
        alert "Mascot file is invalid."

      name = imported["Mascot"]
      delete imported["Mascot"]

      if userMascots[name] and not Conf["Deleted Mascots"].remove name
        unless confirm "A mascot with this name already exists. Would you like to over-write?"
          return

      userMascots[name] = imported

      $.set 'userMascots', userMascots
      alert "Mascot \"#{name}\" imported!"
      $.rm $("#mascotContainer", d.body)
      Options.mascotTab.dialog()

    reader.readAsText(file)