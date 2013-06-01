MascotTools =
  init: (mascot) ->
    unless mascot and mascot.image?
      return unless Conf[g.MASCOTSTRING].length
      name = Conf[g.MASCOTSTRING][Math.floor(Math.random() * Conf[g.MASCOTSTRING].length)]
      mascot = Mascots[name]
      Conf['mascot'] = name

    unless @el
      @el = $ '#mascot img', d.body
      
    el = @el

    if !Conf['Mascots'] or (Conf['Hide Mascots on Catalog'] and g.VIEW is 'catalog')
      return if el then el.src = "" else null

    if mascot.position is 'bottom' and Conf['Mascot Position'] is 'default'
      $.rmClass doc, 'mascot-position-default'
      $.addClass doc, 'mascot-position-bottom'
    else
      $.addClass doc, 'mascot-position-default'
      $.rmClass doc, 'mascot-position-bottom'
    
    unless mascot
      if name and not mascot = Mascots[name]
        if el then el.src = "" else null
        Conf[g.MASCOTSTRING].remove name
        return MascotTools.init()

    MascotTools.addMascot mascot

    Style.mascot.textContent = """
#mascot {
  display: none;
}
.mascots #mascot {
  display: block;
}
.sidebar-location-left #mascot img {
  <%= sizing %>transform: scaleX(-1);
}
.sidebar-location-right.mascot-location-sidebar #mascot img,
.sidebar-location-left #mascot img {
  right: 0;
  left: auto;
  margin-right: #{mascot.hOffset}px;
}
.sidebar-location-right.sidebar-large.mascot-location-sidebar #mascot img,
.sidebar-location-left.sidebar-large #mascot img {
  right: #{if mascot.center then 25 else 0}px;
}
.sidebar-location-left.mascot-location-sidebar #mascot img,
.sidebar-location-right #mascot img {
  left: 0;
  right: auto;
  margin-left: #{mascot.hOffset}px;
}
.sidebar-location-left.sidebar-large.mascot-location-sidebar #mascot img,
.sidebar-location-right.sidebar-large #mascot img {
  left: #{if mascot.center then 25 else 0}px;
}
#mascot img {
  position: fixed;
  z-index: -1;
  bottom: 20.1em;
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
  margin-bottom: #{mascot.vOffset or 0}px;
  cursor: pointer;
}
.fourchan-ss-navigation.bottom.fixed.posting-disabled #mascot img,
.fourchan-ss-navigation.bottom.fixed.mascot-position-bottom #mascot img,
.fourchan-ss-navigation.index.pagination-sticky-bottom.mascot-position-bottom #mascot img,
.fourchan-ss-navigation.bottom.fixed:not(.post-form-style-fixed):not(.post-form-style-transparent-fade) #mascot img,
.fourchan-ss-navigation.index.pagination-sticky-bottom:not(.post-form-style-fixed):not(.post-form-style-transparent-fade) #mascot img {
  bottom: 1.5em;
}
.fourchan-ss-navigation.bottom.fixed #mascot img,
.fourchan-ss-navigation.index.pagination-sticky-bottom #mascot img {
  bottom: 21.6em;
}
.fourchan-ss-navigation.bottom.fixed.post-form-decorations #mascot img,
.fourchan-ss-navigation.index.pagination-sticky-bottom.post-form-decorations #mascot img {
  bottom: 21.8em;
}
.fourchan-ss-navigation.bottom.fixed.show-post-form-header.post-form-style-fixed #mascot img,
.fourchan-ss-navigation.index.pagination-sticky-bottom.show-post-form-header.post-form-style-fixed #mascot img,
.fourchan-ss-navigation.bottom.fixed.show-post-form-header.post-form-style-transparent-fade #mascot img,
.fourchan-ss-navigation.index.pagination-sticky-bottom.show-post-form-header.post-form-style-transparent-fade #mascot img {
  bottom: 22.9em;
}
.fourchan-ss-navigation.bottom.fixed.show-post-form-header.post-form-style-fixed.post-form-decorations #mascot img,
.fourchan-ss-navigation.index.pagination-sticky-bottom.show-post-form-header.post-form-style-fixed.post-form-decorations #mascot img,
.fourchan-ss-navigation.bottom.fixed.show-post-form-header.post-form-style-transparent-fade.post-form-decorations #mascot img,
.fourchan-ss-navigation.index.pagination-sticky-bottom.show-post-form-header.post-form-style-transparent-fade.post-form-decorations #mascot img {
  bottom: 23.1em;
}
.mascot-position-bottom #mascot img,
.mascot-position-default.posting-disabled #mascot img {
  bottom: 0;
}
.mascots-overlap-posts #mascot img {
  z-index: 3;
}
.mascot-position-middle #mascot img {
  bottom: 50%;
  <%= sizing %>transform: translateY(50%);
}
.mascot-position-top #mascot img {
  bottom: auto !important;
  top: 17px;
}
.grayscale-mascots #mascot img {
  filter: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><filter id="filters"><feColorMatrix id="color" type="saturate" values="0" /></filter></svg>#filters');
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
    MascotTools.init editMascot
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
      innerHTML: "
<div id=mascotbar>
</div>
<hr>
<div id=mascotcontent>
  <center>
    PROTIP: Shift-Click the Mascot Image field to upload your own images!
    <br>
    <a href='https://github.com/zixaphir/appchan-x/issues/126#issuecomment-14365049'>This may have some caveats.</a>
  </center>
</div>
<div id=save>
  <a href='javascript:;'>Save Mascot</a>
</div>
<div id=close>
  <a href='javascript:;'>Close</a>
</div>
"
    nodes = []
    for name, item of layout

      switch item[2]

        when "text"
          div = @input item, name
          input = $ 'input', div

          if name is 'image'

            $.on input, 'blur', ->
              editMascot[@name] = @value
              MascotTools.addMascot editMascot
              MascotTools.init editMascot

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
              MascotTools.init editMascot

          else

            $.on input, 'blur', ->
              editMascot[@name] = @value
              MascotTools.init editMascot

        when "number"
          div = @input item, name
          $.on $('input', div), 'blur', ->
            editMascot[@name] = parseInt @value
            MascotTools.init editMascot

        when "select"
          value = editMascot[name] or item[1]
          optionHTML = "<div class=optionlabel>#{item[0]}</div><div class=option><select name='#{name}' value='#{value}'><br>"
          for option in item[3]
            optionHTML = optionHTML + "<option value=\"#{option}\">#{option}</option>"
          optionHTML = optionHTML + "</select></div>"
          div = $.el 'div',
            className: "mascotvar"
            innerHTML: optionHTML
          setting = $ "select", div
          setting.value = value

          $.on $('select', div), 'change', ->
            editMascot[@name] = @value
            MascotTools.init editMascot

        when "checkbox"
          value = editMascot[name] or item[1]
          div = $.el "div",
            className: "mascotvar"
            innerHTML: "<label><input type=#{item[2]} class=field name='#{name}' #{if value then 'checked'}>#{item[0]}</label>"
          $.on $('input', div), 'click', ->
            editMascot[@name] = if @checked then true else false
            MascotTools.init editMascot

      nodes.push div
    $.add $("#mascotcontent", dialog), nodes

    $.on $('#save > a', dialog), 'click', ->
      MascotTools.save editMascot

    $.on  $('#close > a', dialog), 'click', MascotTools.close
    Rice.nodes(dialog)
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
      innerHTML: "<div class=optionlabel>#{item[0]}</div><div class=option><input type=#{item[2]} class=field name='#{name}' placeholder='#{item[0]}' value='#{value}'></div>"

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
    image = 
      if Array.isArray mascot.image 
        if Style.lightTheme
          mascot.image[1]
        else
          mascot.image[0]
      else mascot.image
    if el = @el
      el.src = image
    else
      div = $.el 'div',
        id: "mascot"
        innerHTML: "<img src='#{image}'>"

      @el = div.firstElementChild
      
      $.on @el, 'mousedown', MascotTools.click

      $.add d.body, div

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
    $.get "userMascots", {}, (item) ->
      userMascots = item['userMascots']
      userMascots[name] = Mascots[name]
      $.set 'userMascots', userMascots
      alert "Mascot \"#{name}\" saved."

  click: (e) ->
    e.preventDefault()
    MascotTools.init()

  close: ->
    Conf['editMode'] = false
    editMascot = {}
    $.rm $.id 'mascotConf'
    Style.addStyle()
    Settings.open "mascots"

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
      Settings.open 'mascots'

    reader.readAsText(file)