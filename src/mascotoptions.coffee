MascotTools =
  init: ->
    if Conf['Post Form Style'] == "fixed" or Conf['Post Form Style'] == "transparent fade" then mascotposition = '264' else mascotposition = '0'
    unless editMode 
      mascotnames = []
      try
        $.rm $('#mascot', d.body)
      for name, mascot of userMascots
        if enabledmascots[name] == true
          mascotnames.push name
      unless Conf["mascot"] = mascotnames[Math.floor(Math.random() * mascotnames.length)]
        return
      mascot = userMascots[Conf["mascot"]]
    else
      unless mascot = userMascots[Conf["mascot"]]
        return
    div = $.el 'div',
      id: "mascot"
    div.innerHTML = "<img src='#{mascot.image}'>"
    $.ready ->
      $.add d.body, div

    result = "
#mascot img {
  position: fixed;
  z-index:  " + (if Conf['Mascots Overlap Posts'] then '3' else '-1') + ";
  bottom:   " + (if mascot.position == 'bottom' then (0 + (mascot.vOffset or 0) + "px") else if mascot.position == 'top' then "auto" else (mascotposition + (mascot.vOffset or 0)) + "px") + ";
  right:    " + (mascot.hoffset or 0 + (unless Conf['Sidebar'] == 'large' and mascot.center then 0 else 25)) + "px;
  top:      " + (if mascot.position == 'top' then (mascot.vOffset or 0) + "px" else 'auto') + ";
  left:     auto;
  pointer-events: none;
}
"
    return result


  dialog: (key) ->
    editMascot = userThemes[key] or {}
    editMascot.name = key or ''
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
        0
        "This value moves the mascot vertically away from the anchor point, in pixels (the post form is exactly \"264\" pixels tall if you'd like to force the mascot to sit above it)."
        "number"
      ]
      hOffset: [
        "Horizontal Offset"
        0
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
<div id=cancel>
  <a href='javascript:;'>Cancel</a>
</div>
"
    for item in layout
        div = $.el "div",
          className: "themevar"
          innerHTML: "<div class=optionname>#{item}</div><div class=option><input class=field name='#{item}' placeholder='#{item}' value='#{editTheme[item]}'>"
        $.on $('input', div), 'blur', ->
          editTheme[@name] = @value
          Style.addStyle(editTheme)
        $.add $("#themecontent", dialog), div
    $.on $('#save > a', dialog), 'click', ->
      ThemeTools.save editTheme
    $.on  $('#cancel > a', dialog), 'click', ThemeTools.close
    