MascotTools =
  init: (mascot = Conf[g.MASCOTSTRING][Math.floor(Math.random() * Conf[g.MASCOTSTRING].length)]) ->

    Conf['mascot'] = mascot
    @el = el = $('#mascot img', d.body)

    if !Conf['Mascots'] or (g.CATALOG and Conf['Hide Mascots on Catalog'])
      return if el then el.src = "" else null

    position = "#{if Conf['Mascot Position'] is 'bottom' or !(Conf['Mascot Position'] is "default" and Conf['Post Form Style'] is "fixed")
      0
    else
      20.2 + (if !g.REPLY or !!$ '#postForm input[name=spoiler]' then 1.4 else 0)
    }em"

    # If we're editting anything, let's not change mascots any time we change a value.
    if Conf['editMode']
      unless mascot = editMascot or mascot = Mascots[Conf["mascot"]]
        return

    else
      unless Conf["mascot"]
        return if el then el.src = "" else null

      unless mascot = Mascots[Conf["mascot"]]
        Conf[g.MASCOTSTRING].remove Conf["mascot"]
        return @init()

      @addMascot mascot

    if Conf["Sidebar Location"] is 'left'
      if Conf["Mascot Location"] is "sidebar"
        location = 'left'
      else
        location = 'right'
    else if Conf["Mascot Location"] is "sidebar"
      location = 'right'
    else
      location = 'left'

    filters = []

    if Conf["Grayscale Mascots"]
      filters.push '<feColorMatrix id="color" type="saturate" values="0" />'

    Style.mascot.textContent = """
#mascot img {
  position: fixed;
  z-index: #{
    if Conf['Mascots Overlap Posts']
      '3'
    else
      '-1'
  };
  bottom: #{
    if mascot.position is 'top'
      'auto'
    else if (mascot.position is 'bottom' and Conf['Mascot Position'] is 'default') or !$.id 'postForm'
      '0'
    else
      position
  };
  #{location}: #{
    (mascot.hOffset or 0) + (
      if Conf['Sidebar'] is 'large' and mascot.center
        25
      else
        0
    )
  }px;
  top: #{
    if mascot.position is 'top'
      '0'
    else
      'auto'
  };
  height: #{
    if mascot.height and isNaN parseFloat mascot.height
      mascot.height
    else if mascot.height
      parseInt(mascot.height, 10) + 'px'
    else
      'auto'
  };
  width: #{
    if mascot.width and isNaN parseFloat mascot.width
      mascot.width
    else if mascot.width
      parseInt(mascot.width,  10) + 'px'
    else
      'auto'
  };
  margin-#{location}: #{mascot.hOffset or 0}px;
  margin-bottom: #{mascot.vOffset or 0}px;
  opacity: #{Conf['Mascot Opacity']};
  pointer-events: none;
  #{if filters.length > 0 then "filter: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\"><filter id=\"filters\">" + filters.join("") + "</filter></svg>#filters');" else ""}
}
"""

  categories: [
    'Anime'
    'Ponies'
    'Questionable'
    'Silhouette'
    'Western'
  ]

  dialog: (key) ->
    Conf['editMode'] = 'mascot'
    if Mascots[key]
      editMascot = JSON.parse(JSON.stringify(Mascots[key]))
    else
      editMascot = {}
    editMascot.name = key or ''
    MascotTools.addMascot editMascot
    Style.addStyle()
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
        "This value moves the mascot vertically away from the anchor point."
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

          if name is 'image'

            $.on input, 'blur', ->
              editMascot[@name] = @value
              MascotTools.addMascot editMascot
              Style.addStyle()

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

          if name is 'name'

            $.on input, 'blur', ->
              @value = @value.replace /[^a-z-_0-9]/ig, "_"
              unless /^[a-z]/i.test @value
                return alert "Mascot names must start with a letter."
              editMascot[@name] = @value
              MascotTools.addMascot editMascot
              Style.addStyle()

          else

            $.on input, 'blur', ->
              editMascot[@name] = @value
              MascotTools.addMascot editMascot
              Style.addStyle()

        when "number"
          div = @input item, name
          $.on $('input', div), 'blur', ->
            editMascot[@name] = parseInt @value
            MascotTools.addMascot editMascot
            Style.addStyle()

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
            Style.addStyle()

        when "checkbox"
          value = editMascot[name] or item[1]
          div = $.el "div",
            className: "mascotvar"
            innerHTML: "<h2><label><input type=#{item[3]} class=field name='#{name}' #{if value then 'checked'}>#{item[0]}</label></h2><span class=description>#{item[2]}</span>"
          $.on $('input', div), 'click', ->
            editMascot[@name] = if @checked then true else false
            MascotTools.addMascot editMascot
            Style.addStyle()

      $.add $("#mascotcontent", dialog), div

    $.on $('#save > a', dialog), 'click', ->
      MascotTools.save editMascot

    $.on  $('#close > a', dialog), 'click', MascotTools.close
    Style.rice(dialog)
    $.add d.body, dialog

  input: (item, name) ->
    if Array.isArray(editMascot[name])
      if Style.lightTheme
        value = editMascot[name][1]
      else
        value = editMascot[name][0]
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
      Style.addStyle()

    reader.readAsDataURL file

  addMascot: (mascot) ->
    if el = @el
      el.src = if Array.isArray(mascot.image) then (if Style.lightTheme then mascot.image[1] else mascot.image[0]) else mascot.image
    else
      @el = el = $.el 'div',
        id: "mascot"
        innerHTML: "<img src='#{if Array.isArray(mascot.image) then (if Style.lightTheme then mascot.image[1] else mascot.image[0]) else mascot.image}'>"

      $.add d.body, el

  save: (mascot) ->
    {name, image} = mascot
    if !name? or name is ""
      alert "Please name your mascot."
      return

    if !image? or image is ""
      alert "Your mascot must contain an image."
      return

    unless mascot.category
      mascot.category = MascotTools.categories[0]

    if Mascots[name]

      if Conf["Deleted Mascots"].contains name
        Conf["Deleted Mascots"].remove name
        $.set "Deleted Mascots", Conf["Deleted Mascots"]

      else
        if confirm "A mascot named \"#{name}\" already exists. Would you like to over-write?"
          delete Mascots[name]
        else
          return alert "Creation of \"#{name}\" aborted."

    for type in ["Enabled Mascots", "Enabled Mascots sfw", "Enabled Mascots nsfw"]
      unless Conf[type].contains name
        Conf[type].push name
        $.set type, Conf[type]
    Mascots[name]        = JSON.parse(JSON.stringify(mascot))
    Conf["mascot"]       = name
    delete Mascots[name].name
    userMascots = $.get "userMascots", {}
    userMascots[name] = Mascots[name]
    $.set 'userMascots', userMascots
    alert "Mascot \"#{name}\" saved."

  close: ->
    Conf['editMode'] = false
    editMascot = {}
    $.rm $("#mascotConf", d.body)
    Style.addStyle()
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

      if Mascots[name] and not Conf["Deleted Mascots"].remove name
        unless confirm "A mascot with this name already exists. Would you like to over-write?"
          return

      Mascots[name] = imported

      userMascots = $.get "userMascots", {}
      userMascots[name] = Mascots[name]
      $.set 'userMascots', userMascots

      alert "Mascot \"#{name}\" imported!"
      $.rm $("#mascotContainer", d.body)
      Options.mascotTab.dialog()

    reader.readAsText(file)