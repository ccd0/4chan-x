MascotTools =
  init: (mascot) ->
    if Conf['Post Form Style'] == "fixed" or Conf['Post Form Style'] == "transparent fade" then mascotposition = '264' else mascotposition = '0'
    try
      $.rm $('#mascot', d.body)
    unless mascot
      mascotnames = []
      for name, mascot of userMascots
        if enabledmascots[name] == true
          mascotnames.push name
      unless mascot = userMascots[mascotnames[Math.floor(Math.random() * mascotnames.length)]]
        return
    div = $.el 'div',
      id: "mascot"
    div.innerHTML = "<img src='#{mascot.image}'>"
    $.ready ->
      $.add d.body, div

    result = "
#mascot img {
  position: fixed;
  bottom: " + (if mascot.position == 'bottom' then (0 + (mascot.vOffset or 0) + "px") else if mascot.position == 'top' then "auto" else (mascotposition + mascot.vOffset) + "px") + ";
  right:  " + (mascot.hoffset or 0 + (unless Conf['Sidebar'] == 'large' and mascot.center then 0 else 25)) + "px;
  top:    " + (if mascot.position == 'top' then (mascot.vOffset or 0) + "px" else 'auto') + ";
  left:   auto;
  pointer-events: none;
}
#mascot img {
  z-index: " + (if Conf['Mascots Overlap Posts'] then '3' else '-1') + ";
}
"
    return result


  dialog: (key) ->
    editMascot = userThemes[key] or {}
    editMascot["Name"] = key or ''
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
    