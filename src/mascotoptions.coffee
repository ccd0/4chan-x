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
    layout = ["top": "", "bottom": "", "sideoffset": ""]

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