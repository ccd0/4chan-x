MascotTools =
  init: ->
    return if !Conf['Mascots'] or (g.VIEW is 'catalog' and Conf['Hide Mascots on Catalog'])

    if Conf['Click to Toggle']
      $.on @el, 'mousedown', MascotTools.click

    $.on doc, 'QRDialogCreation', MascotTools.position

    $.asap (-> d.body), =>
      $.add d.body, @el

    MascotTools.toggle()

  el: $.el 'div',
    id: "mascot"
    innerHTML: "<img>"

  change: (mascot) ->
    if Conf['Mascot Position'] is 'default'
      $.rmClass doc, 'mascot-position-above-post-form'
      $.rmClass doc, 'mascot-position-bottom'
      $.rmClass doc, 'mascot-position-default'
      $.addClass doc, if mascot.position is 'bottom'
        'mascot-position-bottom'
      else
        'mascot-position-above-post-form'

    $[if mascot.silhouette or Conf['Silhouettize Mascots']
      'addClass'
    else
      'rmClass'
    ] doc, 'silhouettize-mascots'

    el  = $.el 'img' # new mascot
    img = @el.firstElementChild # old mascot, if any

    unless mascot.image is ''
      $.on el, 'error', MascotTools.error
      el.src = mascot.image

    $.off img, 'error', MascotTools.error
    $.replace img, el

    MascotTools.position()

  error: ->
    return unless @src
    @src = MascotTools.imageError if MascotTools.imageError
    el = $.el 'canvas',
      width:  248
      height: 100
    ctx = el.getContext('2d')
    ctx.font         = "40px #{Conf['Font']}"
    ctx.fillStyle    = (new Color (Themes[Conf[g.THEMESTRING]] or Themes[if g.TYPE is 'sfw' then 'Yotsuba B' else 'Yotsuba'])['Text']).hex()
    ctx.textAlign    = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText "Mascot 404", 124, 50
    el.toBlob (blob) =>
      @src = MascotTools.imageError = URL.createObjectURL blob

  toggle: ->
    string  = g.MASCOTSTRING
    enabled = Conf[string]
    return MascotTools.change {image: '', height: 0, width: 0} unless len = enabled.length

    Conf['mascot'] = name = enabled[i = Math.floor(Math.random() * len)]

    unless mascot = Mascots[name]
      enabled.splice i, 1
      $.replace el, $.el 'img' if el = @el.firstElementChild
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
      editMascot = JSON.parse JSON.stringify Mascots[key]
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
      silhouette: [
        "Silhouette"
        false
        "checkbox"
      ]

    dialog = $.el "div",
      id: "mascotConf"
      className: "reply dialog"
      innerHTML: """<%= grunt.file.read('src/General/html/Features/MascotDialog.html').replace(/>\s+</g, '><').trim() %>"""

    container = $ "#mascotcontent", dialog
    
    fileRice = (e) ->
      if e.shiftKey
        @nextSibling.click()
    
    updateMascot = ->
      MascotTools.change editMascot
    
    saveVal = ->
      editMascot[@name] = @value
      updateMascot()

    imageFn = ->
      if MascotTools.URL is @value
        return MascotTools.change editMascot
      else if MascotTools.URL
        URL.revokeObjectURL MascotTools.URL
        delete MascotTools.URL
      saveVal.call @
    
    nameFn = ->
      @value = @value.replace /[^a-z-_0-9]/ig, "_"
      if (@value isnt "") and !/^[a-z]/i.test @value
        return alert "Mascot names must start with a letter."
      saveVal.call @
    
    saveCheck = ->
      editMascot[@name] = if @checked then true else false
      updateMascot()

    for name, item of layout
      value = editMascot[name] or= item[1]

      switch item[2]

        when "text"
          div = @input item, name
          input = $ 'input', div

          switch name
            when 'image'
              $.on input, 'blur', imageFn

              fileInput = $.el 'input',
                type:     "file"
                accept:   "image/*"
                title:    "imagefile"
                hidden:   "hidden"

              $.on input, 'click', fileRice

              $.on fileInput, 'change', MascotTools.uploadImage

              $.after input, fileInput

            when 'name'
              $.on input, 'blur', nameFn

            else
              $.on input, 'blur', saveVal

        when "number"
          div = @input item, name
          $.on $('input', div), 'blur', saveVal

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

          $.on $('select', div), 'change', saveVal

        when "checkbox"
          div = $.el "div",
            className: "mascotvar"
            innerHTML: "<label><input type=#{item[2]} class=field name='#{name}' #{if value then 'checked'}>#{item[0]}</label>"
          $.on $('input', div), 'click', saveCheck

      $.add container, div

    MascotTools.change editMascot

    $.on $('#save > a', dialog), 'click', ->
      MascotTools.save editMascot

    $.on  $('#close > a', dialog), 'click', MascotTools.close
    Rice.nodes dialog
    $.add d.body, dialog

  input: (item, name) ->
    value = editMascot[name]

    editMascot[name] = value

    $.el "div",
      className: "mascotvar"
      innerHTML: "<div class=optionlabel>#{item[0]}</div><div class=option><input type=#{item[2]} class=field name='#{name}' placeholder='#{item[0]}' value='#{value}'></div>"

  uploadImage: ->
    return unless @files and file = @files[0]
    URL.revokeObjectURL MascotTools.URL if MascotTools.URL
    img = $.el 'img'
    img.onload = =>
      s = 400
      {width, height} = img
      if width <= s
        MascotTools.setImage fileURL
        @previousElementSibling.value = fileURL
        return

      cv = $.el 'canvas',
        height: height = s / width * height
        width:  width  = s
      cv.getContext('2d').drawImage img, 0, 0, width, height
      URL.revokeObjectURL fileURL
      cv.toBlob (blob) =>
        MascotTools.URL = fileURL = URL.createObjectURL MascotTools.file = blob
        MascotTools.setImage fileURL
        @previousElementSibling.value = fileURL

    MascotTools.URL = fileURL = URL.createObjectURL MascotTools.file = file
    img.src = fileURL

  setImage: (fileURL) ->
    reader = new FileReader()
    reader.onload = ->
      editMascot.image = reader.result
    reader.readAsDataURL MascotTools.file

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
      if $.remove Conf["Deleted Mascots"], name
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
        unless name in Conf[type]
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

  importMascot: ->
    file = @files[0]
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

      if Mascots[name] and not $.remove Conf["Deleted Mascots"], name
        unless confirm "A mascot with this name already exists. Would you like to over-write?"
          return

      Mascots[name] = imported

      $.get "userMascots", {}, ({userMascots}) ->
        userMascots[name] = Mascots[name]
        $.set 'userMascots', userMascots

      alert "Mascot \"#{name}\" imported!"
      $.rm $ "#mascotContainer", d.body
      Settings.open 'Mascots'

    reader.readAsText file

  position: ->
    return unless Style.sheets.mascots
    mascot = Mascots[Conf['mascot']]
    Style.sheets.mascots.textContent = """<%= grunt.file.read('src/General/css/mascot.css') %>"""
