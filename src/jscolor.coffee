JSColor =

  bind: (el) ->
    el.color = new JSColor.color(el) if not el.color

  images:
    pad:        [ 181, 101 ]
    sld:        [ 16, 101 ]
    cross:      [ 15, 15 ]
    arrow:      [ 7, 11 ]

  fetchElement: (mixed) ->
    if typeof mixed is "string" then document.getElementById(mixed) else mixed

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
    @valueElement       = target         # value holder
    @styleElement       = target         # where to reflect current color
    @hsv                = [0, 0, 1]      # read-only  0-6, 0-1, 0-1
    @rgb                = [1, 1, 1]      # read-only  0-1, 0-1, 0-1
    @minH               = 0              # read-only  0-6
    @maxH               = 6              # read-only  0-6
    @minS               = 0              # read-only  0-1
    @maxS               = 1              # read-only  0-1
    @minV               = 0              # read-only  0-1
    @maxV               = 1              # read-only  0-1
    @pickerButtonHeight = 20             # px
    @pickerButtonColor  = 'ButtonText'   # px
    @pickerFace         = 10             # px
    @pickerFaceColor    = 'ThreeDFace'   # CSS color
    @pickerBorder       = 1              # px
    @pickerBorderColor  = 'ThreeDHighlight ThreeDShadow ThreeDShadow ThreeDHighlight' # CSS color
    @pickerInset        = 1              # px
    @pickerInsetColor   = 'ThreeDShadow ThreeDHighlight ThreeDHighlight ThreeDShadow' # CSS color
    @pickerZIndex       = 1000
    abortBlur    = false
    holdPad      = false
    holdSld      = false

    @hidePicker = ->
      if isPickerOwner()
        removePicker()

    @showPicker = ->
      unless isPickerOwner()
        drawPicker()

    @importColor = ->
      unless valueElement
        @exportColor()
      else
        unless @fromString valueElement.value, leaveValue
          styleElement.style.backgroundColor = styleElement.jscStyle.backgroundColor
          @exportColor leaveValue | leaveStyle

    @exportColor = (flags) ->
      if not (flags & leaveValue) and valueElement
        value = '#' + @toString()
        valueElement.value = value
        valueElement.previousSibling.value = value
        editTheme[valueElement.previousSibling.name] = value

        Style.addStyle(editTheme)

      if not (flags & leaveStyle) and styleElement
        styleElement.style.backgroundColor = '#' + @toString()

      if not (flags & leavePad) and isPickerOwner()
        redrawPad()

      if not (flags & leaveSld) and isPickerOwner()
        redrawSld()

    @fromHSV = (h, s, v, flags) -> # null = don't change
      if h isnt null then h = Math.max(0.0, @minH, Math.min(6.0, @maxH, h))
      if s isnt null then s = Math.max(0.0, @minS, Math.min(1.0, @maxS, s))
      if v isnt null then v = Math.max(0.0, @minV, Math.min(1.0, @maxV, v))

      @rgb = HSV_RGB(
        if h is null then @hsv[0] else (@hsv[0] = h)
        if s is null then @hsv[1] else (@hsv[1] = s)
        if v is null then @hsv[2] else (@hsv[2] = v)
      )

      @exportColor flags

    @fromRGB = (r, g, b, flags) -> # null = don't change
      if r isnt null then r = Math.max(0.0, Math.min(1.0, r))
      if g isnt null then g = Math.max(0.0, Math.min(1.0, g))
      if b isnt null then b = Math.max(0.0, Math.min(1.0, b))

      hsv = RGB_HSV(
        if r is null then @rgb[0] else r
        if g is null then @rgb[1] else g
        if b is null then @rgb[2] else b
      )

      if hsv[0] isnt null
        @hsv[0] = Math.max(0.0, @minH, Math.min(6.0, @maxH, hsv[0]))

      if hsv[2] isnt 0
        @hsv[1] =
          if hsv[1] is null
            null
          else
            Math.max 0.0, @minS, Math.min 1.0, @maxS, hsv[1]

      @hsv[2] =
        if hsv[2] is null
          null
        else
          Math.max 0.0, @minV, Math.min 1.0, @maxV, hsv[2]

      # update RGB according to final HSV, as some values might be trimmed
      rgb = HSV_RGB(@hsv[0], @hsv[1], @hsv[2])
      @rgb[0] = rgb[0]
      @rgb[1] = rgb[1]
      @rgb[2] = rgb[2]

      @exportColor flags

    @fromString = (number, flags) ->
      m = number.match(/^\W*([0-9A-F]{3}([0-9A-F]{3})?)\W*$/i)
      unless m
        return false
      else
        if m[1].length is 6 # 6-char notation
          @fromRGB(
            parseInt(m[1].substr(0,2),16) / 255
            parseInt(m[1].substr(2,2),16) / 255
            parseInt(m[1].substr(4,2),16) / 255
            flags
          )
        else # 3-char notation
          @fromRGB(
            parseInt(m[1].charAt(0)+m[1].charAt(0),16) / 255
            parseInt(m[1].charAt(1)+m[1].charAt(1),16) / 255
            parseInt(m[1].charAt(2)+m[1].charAt(2),16) / 255
            flags
          )
        true

    @toString = ->
      (0x100 | Math.round(255 * @rgb[0])).toString(16).substr(1) +
      (0x100 | Math.round(255 * @rgb[1])).toString(16).substr(1) +
      (0x100 | Math.round(255 * @rgb[2])).toString(16).substr(1)

    RGB_HSV = (r, g, b) ->
      n = Math.min(Math.min(r,g),b)
      v = Math.max(Math.max(r,g),b)
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
      [if h is 6
          0
        else
          h
        m / v
        v]

    HSV_RGB = (h, s, v) ->

      return [ v, v, v ] if h is null

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
          boxB: $.el 'div'
          pad:  $.el 'div'
          padB: $.el 'div'
          padM: $.el 'div'
          sld:  $.el 'div'
          sldB: $.el 'div'
          sldM: $.el 'div'
          btn:  $.el 'div'
          btnS: $.el 'span'
          btnT: $.tn 'Close'

        slider = for i in JSColor.images.sld[1] by (segSize = 4)
          seg = $.el 'div'
          seg.style.cssText = "height: #{segSize}px; font-size: 1px; line-height: 0;"

        $.add p.sld, slider

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

      # picker
      dims                          = getPickerDims THIS
      box.style.width             = dims[0] + 'px'
      box.style.height            = dims[1] + 'px'

      # picker border
      boxB.style.position         = 'absolute'
      boxB.style.clear            = 'both'
      boxB.style.left             = '320px'
      boxB.style.bottom           = '20px'
      boxB.style.zIndex           = THIS.pickerZIndex
      boxB.style.border           = THIS.pickerBorder + 'px solid'
      boxB.style.borderColor      = THIS.pickerBorderColor
      boxB.style.background       = THIS.pickerFaceColor

      # pad image
      pad.style.width             = JSColor.images.pad[0] + 'px'
      pad.style.height            = JSColor.images.pad[1] + 'px'

      # pad border
      padB.style.position         = 'absolute'
      padB.style.left             = THIS.pickerFace  + 'px'
      padB.style.top              = THIS.pickerFace  + 'px'
      padB.style.border           = THIS.pickerInset + 'px solid'
      padB.style.borderColor      = THIS.pickerInsetColor

      # pad mouse area
      padM.style.position         = 'absolute'
      padM.style.left             = '0'
      padM.style.top              = '0'
      padM.style.width            = THIS.pickerFace + 2 * THIS.pickerInset + JSColor.images.pad[0] + JSColor.images.arrow[0] + 'px'
      padM.style.height           = p.box.style.height
      padM.style.cursor           = 'crosshair'

      # slider image
      sld.style.overflow          = 'hidden'
      sld.style.width             = JSColor.images.sld[0] + 'px'
      sld.style.height            = JSColor.images.sld[1] + 'px'

      # slider border
      sldB.style.display          = 'block'
      sldB.style.position         = 'absolute'
      sldB.style.right            = THIS.pickerFace  + 'px'
      sldB.style.top              = THIS.pickerFace  + 'px'
      sldB.style.border           = THIS.pickerInset + 'px solid'
      sldB.style.borderColor      = THIS.pickerInsetColor
      sldB.style.backgroundImage  = "#{Style.agent}linear-gradient(#fff, #000)"

      # slider mouse area
      sldM.style.display          = 'block'
      sldM.style.position         = 'absolute'
      sldM.style.right            = '0'
      sldM.style.top              = '0'
      sldM.style.width            = JSColor.images.sld[0] + JSColor.images.arrow[0] + THIS.pickerFace + 2 * THIS.pickerInset + 'px'
      sldM.style.height           = p.box.style.height

      sldM.style.cursor           = 'pointer'

      # "close" button
      setBtnBorder = ->
        insetColors = THIS.pickerInsetColor.split /\s+/
        pickerOutsetColor = if insetColors.length < 2
          insetColors[0]
        else
          insetColors[1] + ' ' + insetColors[0] + ' ' + insetColors[0] + ' ' + insetColors[1]
        p.btn.style.borderColor = pickerOutsetColor

      btn.style.display       = 'block'
      btn.style.position      = 'absolute'
      btn.style.left          = THIS.pickerFace + 'px'
      btn.style.bottom        = THIS.pickerFace + 'px'
      btn.style.padding       = '0 15px'
      btn.style.height        = '18px'
      btn.style.border        = THIS.pickerInset + 'px solid'
      setBtnBorder()
      btn.style.color         = THIS.pickerButtonColor
      btn.style.textAlign     = 'center'

      btn.style.cursor = 'pointer'

      btn.onmousedown = ->
        THIS.hidePicker()

      btnS.style.lineHeight   = p.btn.style.height

      padImg = "#{Style.agent}linear-gradient(rgba(255,255,255,0), rgba(255,255,255,1)), #{Style.agent}linear-gradient(left, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)"

      padM.style.backgroundImage   = "url('data:image/gif;base64,R0lGODlhDwAPAKEBAAAAAP///////////yH5BAEKAAIALAAAAAAPAA8AAAIklB8Qx53b4otSUWcvyiz4/4AeQJbmKY4p1HHapBlwPL/uVRsFADs=')"
      padM.style.backgroundRepeat  = "no-repeat"
      sldM.style.backgroundImage   = "url('data:image/gif;base64,R0lGODlhBwALAKECAAAAAP///6g8eKg8eCH5BAEKAAIALAAAAAAHAAsAAAITTIQYcLnsgGxvijrxqdQq6DRJAQA7')"
      sldM.style.backgroundRepeat  = "no-repeat"
      pad.style.backgroundImage    = padImg
      pad.style.backgroundRepeat   = "no-repeat"
      pad.style.backgroundPosition = "0 0"

      # place pointers
      redrawPad()
      redrawSld()

      JSColor.picker.owner = THIS
      $.add ThemeTools.dialog, p.boxB

    getPickerDims = (o) ->
      dims = [
        (
          2 * o.pickerInset             +
          2 * o.pickerFace              +
          JSColor.images.pad[0]         +
          (
            2 * o.pickerInset           +
            2 * JSColor.images.arrow[0] +
            JSColor.images.sld[0]
          )
        )
        (
          4 * o.pickerInset       +
          3*o.pickerFace          +
          JSColor.images.pad[1]   +
          o.pickerButtonHeight
        )
      ]

    # redraw the pad pointer
    redrawPad = ->

      yComponent = 1

      x = Math.round (THIS.hsv[0] / 6)          * (JSColor.images.pad[0] - 1)
      y = Math.round (1 - THIS.hsv[yComponent]) * (JSColor.images.pad[1] - 1)

      JSColor.picker.padM.style.backgroundPosition =
        "#{THIS.pickerFace + THIS.pickerInset + x - Math.floor(JSColor.images.cross[0] / 2)}px #{THIS.pickerFace + THIS.pickerInset + y - Math.floor(JSColor.images.cross[1] / 2)}px"

      # redraw the slider image
      seg = JSColor.picker.sld.childNodes

      rgb = HSV_RGB(THIS.hsv[0], THIS.hsv[1], 1)
      for item in seg
        item.style.backgroundColor =
          "rgb(#{rgb[0] * (1 - i / seg.length) * 100}%, #{rgb[1] * (1 - i / seg.length) * 100}%, #{rgb[2] * (1 - i / seg.length) * 100}%)"

      return

    redrawSld = ->
      # redraw the slider pointer
      yComponent = 2

      y = Math.round (1 - THIS.hsv[yComponent]) * (JSColor.images.sld[1] - 1)
      JSColor.picker.sldM.style.backgroundPosition =
        "0 #{THIS.pickerFace + THIS.pickerInset+y - Math.floor(JSColor.images.arrow[1] / 2)}px"


    isPickerOwner = ->
      JSColor.picker and JSColor.picker.owner is THIS

    blurTarget = ->
      if valueElement is target
        THIS.importColor()

    blurValue = ->
      if valueElement isnt target
        THIS.importColor()

    setPad = (e) ->
      mpos = JSColor.getRelMousePos e
      x = mpos.x - THIS.pickerFace - THIS.pickerInset
      y = mpos.y - THIS.pickerFace - THIS.pickerInset
      THIS.fromHSV(
        x * (
          6 / (
            JSColor.images.pad[0] - 1
          )
        )
        1 - y / (
          JSColor.images.pad[1] - 1
        )
        null
        leaveSld
      )

    setSld = (e) ->
      mpos  = JSColor.getRelMousePos e
      y     = mpos.y - THIS.pickerFace - THIS.pickerInset
      THIS.fromHSV(
        null
        null
        1 - y / (
          JSColor.images.sld[1] - 1
        )
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
      updateField = ->
        THIS.fromString valueElement.value, leaveValue

      $.on valueElement, 'keyup input', updateField
      $.on valueElement, 'blur',  blurValue
      valueElement.setAttribute 'autocomplete', 'off'

    # styleElement
    if styleElement
      styleElement.jscStyle =
        backgroundColor:    styleElement.style.backgroundColor

    @importColor()