JSColor =

  bind: (el) ->
    el.color = new JSColor.color(el) if not el.color

  fetchElement: (mixed) ->
    if typeof mixed is "string" then $.id mixed else mixed

  fireEvent: (el, evnt) ->
    return unless el

    ev = document.createEvent 'HTMLEvents'
    ev.initEvent evnt, true, true
    el.dispatchEvent ev

  getRelMousePos: (e = window.event) ->
    x = 0
    y = 0
    if typeof e.offsetX is 'number'
      x = e.offsetX
      y = e.offsetY
    else if typeof e.layerX is 'number'
      x = e.layerX
      y = e.layerY
    x: x
    y: y

  color: (target) ->
    # Read Only
    @hsv  = [0, 0, 1] # 0-6, 0-1, 0-1
    @rgb  = [1, 1, 1] # 0-1, 0-1, 0-1
    
    # Writable.
    # Value holder / Where to reflect current color
    @valueElement = @styleElement = target

    # Blur / Drag trackers
    abortBlur = holdPad = holdSld = false

    @hidePicker = ->
      if isPickerOwner() then removePicker()

    @showPicker = ->
      unless isPickerOwner() then drawPicker()

    @importColor = ->
      unless valueElement
        @exportColor()
      else
        unless @fromString valueElement.value, leaveValue
          styleElement.style.backgroundColor = styleElement.jscStyle.backgroundColor
          @exportColor leaveValue | leaveStyle

    @exportColor = (flags) ->
      if !(flags & leaveValue) and valueElement
        value = '#' + @toString()
        valueElement.value = value
        valueElement.previousSibling.value = value
        editTheme[valueElement.previousSibling.name] = value

        setTimeout -> Style.themeCSS.textContent  = Style.theme editTheme

      if not (flags & leaveStyle) and styleElement
        styleElement.style.backgroundColor = '#' + @toString()

      if not (flags & leavePad) and isPickerOwner()
        redrawPad()

      if not (flags & leaveSld) and isPickerOwner()
        redrawSld()

    @fromHSV = (h, s, v, flags) -> # null = don't change
      @hsv = [
        h =
          if h 
            $.minmax h, 0.0, 6.0
          else
            @hsv[0]
        s =
          if s
            $.minmax s, 0.0, 1.0
          else
            @hsv[1]
        v =
          if v
            $.minmax v, 0.0, 1.0
          else
            @hsv[2]
      ]

      @rgb = HSV_RGB(h, s, v)

      @exportColor flags

    @fromRGB = (r, g, b, flags) -> # null = don't change
      r = 
        if r?
          $.minmax r, 0.0, 1.0
        else
          @rgb[0]
      g =
        if g?
          $.minmax g, 0.0, 1.0
        else
          @rgb[1]
      b = 
        if b?
          $.minmax b, 0.0, 1.0
        else
          @rgb[2]

      hsv = RGB_HSV(r, g, b)

      if hsv[0]?
        @hsv[0] = $.minmax hsv[0], 0.0, 6.0

      if hsv[2] isnt 0
        @hsv[1] =
          unless hsv[1]?
            null
          else
            $.minmax hsv[1], 0.0, 1.0

      @hsv[2] =
        unless hsv[2]?
          null
        else
          $.minmax hsv[2], 0.0, 1.0

      # update RGB according to final HSV, as some values might be trimmed
      @rgb = HSV_RGB @hsv[0], @hsv[1], @hsv[2]

      @exportColor flags

    @fromString = (number, flags) ->
      m = number.match /^\W*([0-9A-F]{3}([0-9A-F]{3})?)\W*$/i
      unless m
        return false
      else
        if m[1].length is 6 # 6-char notation
          @fromRGB(
            parseInt(m[1].substr(0, 2), 16) / 255
            parseInt(m[1].substr(2, 2), 16) / 255
            parseInt(m[1].substr(4, 2), 16) / 255
            flags
          )
        else # 3-char notation
          @fromRGB(
            # Double-up each character to fake 6-char notation.
            parseInt((val = m[1].charAt 0) + val, 16) / 255
            parseInt((val = m[1].charAt 1) + val, 16) / 255
            parseInt((val = m[1].charAt 2) + val, 16) / 255
            flags
          )
        true

    @toString = ->
      (0x100 | Math.round(255 * @rgb[0])).toString(16).substr(1) +
      (0x100 | Math.round(255 * @rgb[1])).toString(16).substr(1) +
      (0x100 | Math.round(255 * @rgb[2])).toString(16).substr(1)

    RGB_HSV = (r, g, b) ->
      n = if (n = if r < g then r else g) < b then n else b
      v = if (v = if r > g then r else g) > b then v else b
      m = v - n

      return [ null, 0, v ] if m is 0

      h =
        if r is n
          3 + (b - g) / m
        else
          if g is n
            5 + (r - b) / m
          else
            1 + (g - r) / m
      [
        if h is 6 then 0 else h
        m / v
        v
      ]

    HSV_RGB = (h, s, v) ->

      return [ v, v, v ] unless h?

      i = Math.floor(h)
      f = 
        if i % 2
          h - i
        else
          1 - (h - i)
      m = v * (1 - s)
      n = v * (1 - s * f)

      switch i
        when 6, 0
          [v,n,m]
        when 1
          [n,v,m]
        when 2 
          [m,v,n]
        when 3
          [m,n,v]
        when 4
          [n,m,v]
        when 5
          [v,m,n]

    removePicker = ->
      delete JSColor.picker.owner
      $.rm   JSColor.picker.boxB

    drawPicker = (x, y) ->
      unless p = JSColor.picker
        JSColor.picker = p =
          box:  $.el 'div'
            className: 'jscBox'
          boxB: $.el 'div'
            className: 'jscBoxB'
          pad:  $.el 'div'
            className: 'jscPad'
          padB: $.el 'div'
            className: 'jscPadB'
          padM: $.el 'div'
            className: 'jscPadM'
          sld:  $.el 'div'
            className: 'jscSld'
          sldB: $.el 'div'
            className: 'jscSldB'
          sldM: $.el 'div'
            className: 'jscSldM'
          btn:  $.el 'div'
            className: 'jscBtn'
          btnS: $.el 'span'
            className: 'jscBtnS'
          btnT: $.tn 'Close'

        $.add p.box,  [p.sldB, p.sldM, p.padB, p.padM, p.btn]
        $.add p.sldB, p.sld
        $.add p.padB, p.pad
        $.add p.btnS, p.btnT
        $.add p.btn,  p.btnS
        $.add p.boxB, p.box

      # controls interaction
      {box, boxB, btn, btnS, pad, padB, padM, sld, sldB, sldM} = p
      box.onmouseup   =
      box.onmouseout  = -> target.focus()
      box.onmousedown = -> abortBlur=true
      box.onmousemove = (e) ->
        if holdPad or holdSld
          holdPad and setPad e
          holdSld and setSld e

          if d.selection
            d.selection.empty()
          else if window.getSelection
            window.getSelection().removeAllRanges()

      padM.onmouseup =
      padM.onmouseout = -> if holdPad
        holdPad = false
        JSColor.fireEvent valueElement, 'change'
      padM.onmousedown = (e) ->
        # If the slider is at the bottom, move it up

        if THIS.hsv[2] is 0
          THIS.fromHSV null, null, 1.0

        holdPad = true
        setPad e

      sldM.onmouseup =
      sldM.onmouseout = -> if holdSld
        holdSld = false
        JSColor.fireEvent valueElement, 'change'
      sldM.onmousedown = (e) ->
        holdSld = true
        setSld e

      btn.onmousedown = ->
        THIS.hidePicker()

      # place pointers
      redrawPad()
      redrawSld()

      JSColor.picker.owner = THIS
      $.add ThemeTools.dialog, p.boxB

    # redraw the pad pointer
    redrawPad = ->
      # The X and Y positions of the picker crosshair, based on the hsv Hue and Saturation values as percentages and the picker's dimensions.
      JSColor.picker.padM.style.backgroundPosition =
        "#{4 + Math.round (THIS.hsv[0] / 6) * 180}px #{4 + Math.round (1 - THIS.hsv[1]) * 100}px"

      rgb = HSV_RGB(THIS.hsv[0], THIS.hsv[1], 1)
      JSColor.picker.sld.style.backgroundColor = "rgb(#{rgb[0] * 100}%, #{rgb[1] * 100}%, #{rgb[2] * 100}%)"

      return

    redrawSld = ->
      # redraw the slider pointer. X will always be 0, Y will always be a percentage of the HSV 'Value' value.
      JSColor.picker.sldM.style.backgroundPosition =
        "0 #{6 + Math.round (1 - THIS.hsv[2]) * 100}px"


    isPickerOwner = ->
      return JSColor.picker and JSColor.picker.owner is THIS

    blurTarget = ->
      if valueElement is target
        THIS.importColor()

    blurValue = ->
      if valueElement isnt target
        THIS.importColor()

    setPad = (e) ->
      mpos = JSColor.getRelMousePos e
      x = mpos.x - 11
      y = mpos.y - 11
      THIS.fromHSV(
        x * (1 / 30)
        1 - y / 100
        null
        leaveSld
      )

    setSld = (e) ->
      mpos  = JSColor.getRelMousePos e
      y     = mpos.y - 9
      THIS.fromHSV(
        null
        null
        1 - y / 100
        leavePad
      )

    THIS         = @
    valueElement = JSColor.fetchElement @valueElement
    styleElement = JSColor.fetchElement @styleElement
    leaveValue   = 1 << 0
    leaveStyle   = 1 << 1
    leavePad     = 1 << 2
    leaveSld     = 1 << 3

    # target
    $.on target, 'focus', ->
      THIS.showPicker()

    $.on target, 'blur', ->
      unless abortBlur
        window.setTimeout(->
            abortBlur or blurTarget()
            abortBlur = false
          )
      else
        abortBlur = false

    # valueElement
    if valueElement
      $.on valueElement, 'keyup input', ->
        THIS.fromString valueElement.value, leaveValue

      $.on valueElement, 'blur', blurValue

      valueElement.setAttribute 'autocomplete', 'off'

    # styleElement
    if styleElement
      styleElement.jscStyle =
        backgroundColor:    styleElement.style.backgroundColor

    @importColor()