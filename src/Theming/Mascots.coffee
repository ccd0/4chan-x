MascotTools =
  init: ->
    return if !Conf['Mascots'] or (g.VIEW is 'catalog' and Conf['Hide Mascots on Catalog'])

    if Conf['Click to Toggle']
      $.on @el, 'mousedown', MascotTools.click

    $.on doc, 'QRDialogCreation', MascotTools.reposition

    $.asap (-> d.body), =>
      $.add d.body, @el

    MascotTools.toggle()

  el: $.el 'div',
    id: "mascot"
    innerHTML: "<img>"

  change: (mascot) ->
    el = @el.firstElementChild

    if Conf['Mascot Position'] is 'default'
      $.rmClass doc, 'mascot-position-above-post-form'
      $.rmClass doc, 'mascot-position-bottom'
      $.rmClass doc, 'mascot-position-default'
      if mascot.position is 'bottom'
        $.addClass doc, 'mascot-position-bottom'
      else
        $.addClass doc, 'mascot-position-above-post-form'

    if mascot.silhouette and not Conf['Silhouettize Mascots']
      $.addClass doc, 'silhouettize-mascots'

    else unless Conf['Silhouettize Mascots']
      $.rmClass doc, 'silhouettize-mascots'

    el.src = 
      if Array.isArray mascot.image
        if Style.lightTheme
          mascot.image[1]
        else
          mascot.image[0]
      else
        mascot.image

    Style.mascot.textContent = """<%= grunt.file.read('src/General/css/mascot.css') %>"""

  toggle: ->
    string  = g.MASCOTSTRING
    enabled = Conf[string]
    return unless len = enabled.length

    name = enabled[Math.floor(Math.random() * len)]

    unless mascot = Mascots[name]
      enabled.remove name
      el.src = "" if el
      $.set string, Conf[string] = enabled
      return MascotTools.toggle()

    MascotTools.change mascot

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
    layout =
      name: [
        "Mascot Name"
        ""
        "text"
      ]
      image: [
        "Image"
        ""
        "text"
      ]
      category: [
        "Category"
        MascotTools.categories[0]
        "select"
        MascotTools.categories
      ]
      position: [
        "Position"
        "default"
        "select"
        ["default", "top", "bottom"]
      ]
      height: [
        "Height"
        "auto"
        "text"
      ]
      width: [
        "Width"
        "auto"
        "text"
      ]
      vOffset: [
        "Vertical Offset"
        "0"
        "number"
      ]
      hOffset: [
        "Horizontal Offset"
        "0"
        "number"
      ]
      center: [
        "Center Mascot"
        false
        "checkbox"
      ]

    dialog = $.el "div",
      id: "mascotConf"
      className: "reply dialog"
      innerHTML: """<%= grunt.file.read('src/General/html/Features/MascotDialog.html').replace(/>\s+</g, '><').trim() %>"""

    container = $ "#mascotcontent", dialog

    for name, item of layout
      value = editMascot[name] or= item[1]

      switch item[2]

        when "text"
          div = @input item, name
          input = $ 'input', div

          if name is 'image'
            $.on input, 'blur', ->
              editMascot[@name] = @value
              MascotTools.change editMascot

            fileInput = $.el 'input',
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
              if (@value isnt "") and !/^[a-z]/i.test @value
                return alert "Mascot names must start with a letter."
              editMascot[@name] = @value
              MascotTools.change editMascot

          else

            $.on input, 'blur', ->
              editMascot[@name] = @value
              MascotTools.change editMascot

        when "number"
          div = @input item, name
          $.on $('input', div), 'blur', ->
            editMascot[@name] = parseInt @value
            MascotTools.change editMascot

        when "select"
          optionHTML = "<div class=optionlabel>#{item[0]}</div><div class=option><select name='#{name}' value='#{value}'><br>"
          for option in item[3]
            optionHTML += "<option value=\"#{option}\">#{option}</option>"
          optionHTML += "</select></div>"
          div = $.el 'div',
            className: "mascotvar"
            innerHTML: optionHTML
          setting = $ "select", div
          setting.value = value

          $.on $('select', div), 'change', ->
            editMascot[@name] = @value
            MascotTools.change editMascot

        when "checkbox"
          div = $.el "div",
            className: "mascotvar"
            innerHTML: "<label><input type=#{item[2]} class=field name='#{name}' #{if value then 'checked'}>#{item[0]}</label>"
          $.on $('input', div), 'click', ->
            editMascot[@name] = if @checked then true else false
            MascotTools.change editMascot

      $.add container, div

    MascotTools.change editMascot

    $.on $('#save > a', dialog), 'click', ->
      MascotTools.save editMascot

    $.on  $('#close > a', dialog), 'click', MascotTools.close
    Rice.nodes dialog
    $.add d.body, dialog

  input: (item, name) ->
    if Array.isArray editMascot[name]
      if Style.lightTheme
        value = editMascot[name][1]
      else
        value = editMascot[name][0]
    else
      value = editMascot[name]

    editMascot[name] = value

    $.el "div",
      className: "mascotvar"
      innerHTML: "<div class=optionlabel>#{item[0]}</div><div class=option><input type=#{item[2]} class=field name='#{name}' placeholder='#{item[0]}' value='#{value}'></div>"

  uploadImage: (evt, el) ->
    file = evt.target.files[0]
    reader = new FileReader()

    reader.onload = (evt) ->
      val = evt.target.result

      el.previousSibling.value = val
      editMascot.image = val

    reader.readAsDataURL file

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

    Mascots[name] = JSON.parse JSON.stringify mascot
    delete Mascots[name].name

    $.get "userMascots", {}, ({userMascots}) ->
      userMascots[name] = Mascots[name]
      $.set 'userMascots', userMascots

      Conf["mascot"] = name

      for type in ["Enabled Mascots", "Enabled Mascots sfw", "Enabled Mascots nsfw"]
        unless Conf[type].contains name
          Conf[type].push name
          $.set type, Conf[type]
      alert "Mascot \"#{name}\" saved."

  click: (e) ->
    return if e.button isnt 0 # not LMB
    e.preventDefault()
    MascotTools.toggle()

  close: ->
    Conf['editMode'] = false
    editMascot = {}
    $.rm $.id 'mascotConf'
    Settings.open "Mascots"

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

      $.get "userMascots", {}, (item) ->
        userMascots = item['userMascots']
        userMascots[name] = Mascots[name]
        $.set 'userMascots', userMascots

      alert "Mascot \"#{name}\" imported!"
      $.rm $("#mascotContainer", d.body)
      Settings.open 'Mascots'

    reader.readAsText(file)

  reposition: ->
    mascot = Mascots[Conf['mascot']]
    Style.mascot.textContent = """<%= grunt.file.read('src/General/css/mascot.css') %>"""